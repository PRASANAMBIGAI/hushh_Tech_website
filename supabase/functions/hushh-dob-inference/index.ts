// Hushh DOB Inference API - Supabase Edge Function
// Uses Gemini 3 Pro Preview via Vertex AI with Google Search grounding
// Infers Date of Birth using name, address, and public records

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Vertex AI Configuration
const PROJECT_ID = Deno.env.get("GCP_PROJECT_ID") || "hushone-app";
const MODEL_ID = "gemini-3-pro-preview";
const VERTEX_AI_LOCATION = "global";

interface DobInferenceRequest {
  name: string;
  email?: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  residenceCountry?: string;
  phone?: string;
}

interface DobInferenceResult {
  dob: string | null;  // Format: YYYY-MM-DD
  dobDisplay: string | null;  // Format: MM/DD/YYYY for display
  age: number | null;
  confidence: number;  // 0-100
  sources: string[];
  reasoning: string;
}

// Get OAuth access token for Vertex AI
const getAccessToken = async (): Promise<string> => {
  const accessToken = Deno.env.get("GCP_ACCESS_TOKEN") || Deno.env.get("GOOGLE_ACCESS_TOKEN");
  if (accessToken && accessToken.length > 50) {
    return accessToken;
  }
  
  const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
  if (serviceAccountJson) {
    try {
      const sa = JSON.parse(serviceAccountJson);
      
      if (!sa.private_key || !sa.client_email) {
        throw new Error("Service account JSON missing private_key or client_email");
      }
      
      const now = Math.floor(Date.now() / 1000);
      const header = { alg: "RS256", typ: "JWT" };
      const payload = {
        iss: sa.client_email,
        sub: sa.client_email,
        scope: "https://www.googleapis.com/auth/cloud-platform",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600
      };
      
      const encoder = new TextEncoder();
      const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      const unsignedJwt = `${headerB64}.${payloadB64}`;
      
      let privateKeyPem = sa.private_key;
      if (!privateKeyPem.includes('\n') && privateKeyPem.includes('\\n')) {
        privateKeyPem = privateKeyPem.replace(/\\n/g, '\n');
      }
      
      const pemHeader = "-----BEGIN PRIVATE KEY-----";
      const pemFooter = "-----END PRIVATE KEY-----";
      const startIdx = privateKeyPem.indexOf(pemHeader);
      const endIdx = privateKeyPem.indexOf(pemFooter);
      
      if (startIdx === -1 || endIdx === -1) {
        throw new Error("Invalid PEM format");
      }
      
      const pemBody = privateKeyPem
        .substring(startIdx + pemHeader.length, endIdx)
        .replace(/[\r\n\s]/g, '');
      
      const binaryString = atob(pemBody);
      const binaryKey = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        binaryKey[i] = binaryString.charCodeAt(i);
      }
      
      const cryptoKey = await crypto.subtle.importKey(
        "pkcs8",
        binaryKey.buffer,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
      );
      
      const signature = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        cryptoKey,
        encoder.encode(unsignedJwt)
      );
      
      const signatureArray = new Uint8Array(signature);
      let signatureB64 = '';
      for (let i = 0; i < signatureArray.length; i++) {
        signatureB64 += String.fromCharCode(signatureArray[i]);
      }
      signatureB64 = btoa(signatureB64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      
      const signedJwt = `${unsignedJwt}.${signatureB64}`;
      
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${signedJwt}`
      });
      
      const tokenData = await tokenResponse.json();
      
      if (tokenData.access_token) {
        return tokenData.access_token;
      }
      
      throw new Error("Token response missing access_token");
    } catch (e) {
      console.error("Failed to get access token:", e);
      throw e;
    }
  }
  
  throw new Error("No valid GCP access token found");
};

// Call Vertex AI Gemini API with Google Search grounding
const callVertexAI = async (prompt: string): Promise<any> => {
  const accessToken = await getAccessToken();
  
  const endpoint = `https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${VERTEX_AI_LOCATION}/publishers/google/models/${MODEL_ID}:generateContent`;
  
  const requestBody = {
    contents: [{
      role: "user",
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      temperature: 0.3,  // Lower temperature for factual data
      maxOutputTokens: 2048,
    },
    // Google Search Grounding - enables real-time web search
    tools: [{
      googleSearch: {}
    }],
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
    ]
  };
  
  console.log(`🔍 Calling Vertex AI for DOB inference with Google Search grounding`);
  
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Vertex AI Error:", errorText);
    throw new Error(`Vertex AI API error: ${response.status}`);
  }
  
  return await response.json();
};

// Parse DOB from Gemini response
const parseDobResponse = (text: string): DobInferenceResult => {
  const result: DobInferenceResult = {
    dob: null,
    dobDisplay: null,
    age: null,
    confidence: 0,
    sources: [],
    reasoning: ""
  };
  
  // Extract structured data
  const dobMatch = text.match(/DOB:\s*(\d{4}-\d{2}-\d{2})/i);
  if (dobMatch) {
    result.dob = dobMatch[1];
    const [year, month, day] = dobMatch[1].split('-');
    result.dobDisplay = `${month}/${day}/${year}`;
    
    // Calculate age
    const birthDate = new Date(dobMatch[1]);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    result.age = age;
  }
  
  // Extract confidence
  const confidenceMatch = text.match(/CONFIDENCE:\s*(\d+)/i);
  if (confidenceMatch) {
    result.confidence = Math.min(100, parseInt(confidenceMatch[1], 10));
  }
  
  // Extract sources
  const sourcesMatch = text.match(/SOURCES:\s*(.+)/i);
  if (sourcesMatch) {
    result.sources = sourcesMatch[1].split(',').map(s => s.trim()).filter(s => s);
  }
  
  // Extract reasoning
  const reasoningMatch = text.match(/REASONING:\s*(.+?)(?=\n[A-Z]+:|$)/is);
  if (reasoningMatch) {
    result.reasoning = reasoningMatch[1].trim();
  }
  
  return result;
};

// Infer DOB using Gemini + Google Search
const inferDob = async (params: DobInferenceRequest): Promise<DobInferenceResult> => {
  const { name, email, address, residenceCountry, phone } = params;
  
  // Build context from available data
  const contextParts: string[] = [];
  
  if (address?.city) contextParts.push(`City: ${address.city}`);
  if (address?.state) contextParts.push(`State: ${address.state}`);
  if (address?.country) contextParts.push(`Country: ${address.country}`);
  if (address?.zipCode) contextParts.push(`ZIP: ${address.zipCode}`);
  if (residenceCountry) contextParts.push(`Residence: ${residenceCountry}`);
  if (email) contextParts.push(`Email: ${email}`);
  if (phone) contextParts.push(`Phone: ${phone}`);
  
  const contextString = contextParts.length > 0 
    ? contextParts.join(', ')
    : 'No additional context';

  const prompt = `
# DOB INFERENCE TASK

You are an expert public records researcher. Your task is to find the Date of Birth (DOB) for the following person using public records, social media, and available online information.

## TARGET PERSON
- **Full Name**: "${name}"
- **Context**: ${contextString}

## SEARCH STRATEGY

1. **LinkedIn/Professional Profiles**: Search for "${name}" on LinkedIn. Education graduation dates can help estimate birth year.
2. **Social Media**: Check Twitter/X, Facebook, Instagram for birthday announcements.
3. **Public Records**: Search voter records, property records, court records.
4. **News Articles**: Look for age mentions in news articles featuring this person.
5. **Wikipedia/Bio Pages**: Check for biographical information.

## ONOMASTIC AGE ESTIMATION (Backup Method)

If exact DOB cannot be found, estimate using name popularity curves:

| Name Pattern | Peak Popularity | Estimated Age Range (2026) |
|-------------|-----------------|---------------------------|
| Ankit, Amit, Priya | 1985-1995 | 31-41 years |
| Rahul, Arun, Sanjay | 1970-1985 | 41-56 years |
| Aarav, Advait, Ananya | 2010-2020 | 6-16 years |
| Michael, David, James | 1950-1965 | 61-76 years |
| Jason, Jennifer | 1970-1985 | 41-56 years |
| Joshua, Jessica, Ashley | 1985-2000 | 26-41 years |

For the name "${name.split(' ')[0]}", determine the most likely birth year range.

## OUTPUT FORMAT (STRICT)

You MUST respond with EXACTLY this format:

DOB: YYYY-MM-DD
CONFIDENCE: [0-100]
SOURCES: [comma-separated list of sources used]
REASONING: [1-2 sentence explanation of how you determined the DOB]

**IMPORTANT RULES**:
- If you find an exact DOB, use CONFIDENCE: 90-100
- If you find birth year only, use month/day as 06-15 (middle of year) with CONFIDENCE: 60-75
- If you can only estimate from name patterns, use CONFIDENCE: 30-50
- If person appears to be in tech/startup (email domain, context), likely age 25-45
- The current year is 2026 for age calculations

**Example Response**:
DOB: 1990-06-15
CONFIDENCE: 65
SOURCES: LinkedIn graduation year, Name popularity curve
REASONING: LinkedIn shows graduation in 2012 (typical age 22), suggesting birth around 1990. Name "Ankit" peaked in popularity 1985-1995, consistent with this estimate.

Now search for "${name}" and provide the DOB inference:
`;

  try {
    const response = await callVertexAI(prompt);
    
    let text = "";
    if (response.candidates && response.candidates[0]?.content?.parts) {
      text = response.candidates[0].content.parts
        .map((part: any) => part.text || "")
        .join("");
    }
    
    console.log(`📋 Gemini response for DOB:`, text.substring(0, 500));
    
    const result = parseDobResponse(text);
    
    // Add grounding sources if available
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata?.groundingChunks) {
      groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          result.sources.push(chunk.web.uri);
        }
      });
    }
    
    return result;
    
  } catch (error) {
    console.error("DOB inference error:", error);
    
    // Fallback: Use onomastic estimation based on first name
    const firstName = name.split(' ')[0].toLowerCase();
    
    // Indian names born 1985-1995
    const indianMillennial = ['ankit', 'amit', 'priya', 'pooja', 'neha', 'rahul', 'vikas', 'deepak'];
    
    // Western millennial names
    const westernMillennial = ['joshua', 'jessica', 'ashley', 'brittany', 'tyler', 'brandon'];
    
    let estimatedYear = 1990;
    let confidence = 25;
    
    if (indianMillennial.includes(firstName)) {
      estimatedYear = 1990;
      confidence = 35;
    } else if (westernMillennial.includes(firstName)) {
      estimatedYear = 1992;
      confidence = 35;
    }
    
    return {
      dob: `${estimatedYear}-06-15`,
      dobDisplay: `06/15/${estimatedYear}`,
      age: 2026 - estimatedYear,
      confidence,
      sources: ['Name popularity analysis (fallback)'],
      reasoning: `Estimated based on first name "${firstName}" popularity patterns. Low confidence due to search failure.`
    };
  }
};

// HTTP Handler
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Use POST." }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: DobInferenceRequest = await req.json();
    
    if (!body.name) {
      return new Response(
        JSON.stringify({ error: "Missing required field: name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`🎂 DOB Inference request for: ${body.name}`);
    
    const result = await inferDob(body);

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("API Error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
