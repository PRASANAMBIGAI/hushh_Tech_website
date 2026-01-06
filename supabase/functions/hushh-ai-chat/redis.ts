/**
 * Upstash Redis Client for Hushh AI
 * Used for: Rate limiting, caching, session management
 */

const UPSTASH_REDIS_REST_URL = Deno.env.get('UPSTASH_REDIS_REST_URL') || '';
const UPSTASH_REDIS_REST_TOKEN = Deno.env.get('UPSTASH_REDIS_REST_TOKEN') || '';

interface RedisResponse<T = unknown> {
  result: T;
  error?: string;
}

/**
 * Execute a Redis command via Upstash REST API
 */
async function executeCommand<T = unknown>(command: string[]): Promise<T | null> {
  try {
    const response = await fetch(`${UPSTASH_REDIS_REST_URL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });

    if (!response.ok) {
      console.error('Redis error:', response.statusText);
      return null;
    }

    const data: RedisResponse<T> = await response.json();
    if (data.error) {
      console.error('Redis error:', data.error);
      return null;
    }

    return data.result;
  } catch (error) {
    console.error('Redis connection error:', error);
    return null;
  }
}

// ============================================
// Rate Limiting
// ============================================

/**
 * Check if user has exceeded rate limit
 * @param userId - User ID
 * @param limit - Max requests per window
 * @param windowSeconds - Time window in seconds
 * @returns { allowed: boolean, remaining: number, resetIn: number }
 */
export async function checkRateLimit(
  userId: string,
  limit: number = 100,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const key = `hushh-ai:ratelimit:${userId}`;
  
  // Get current count
  const count = await executeCommand<number>(['GET', key]);
  const currentCount = count || 0;

  if (currentCount >= limit) {
    // Get TTL to know when it resets
    const ttl = await executeCommand<number>(['TTL', key]);
    return { allowed: false, remaining: 0, resetIn: ttl || windowSeconds };
  }

  // Increment counter
  await executeCommand(['INCR', key]);
  
  // Set expiry if this is the first request in the window
  if (currentCount === 0) {
    await executeCommand(['EXPIRE', key, String(windowSeconds)]);
  }

  return { 
    allowed: true, 
    remaining: limit - currentCount - 1, 
    resetIn: 0 
  };
}

/**
 * Check media upload limit (20 per day)
 */
export async function checkMediaUploadLimit(userId: string): Promise<{
  allowed: boolean;
  used: number;
  remaining: number;
  resetsAt: string;
}> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const key = `hushh-ai:media-limit:${userId}:${today}`;
  const maxUploads = 20;

  // Get current count
  const count = await executeCommand<number>(['GET', key]);
  const used = count || 0;

  if (used >= maxUploads) {
    // Calculate reset time (midnight UTC)
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    
    return {
      allowed: false,
      used,
      remaining: 0,
      resetsAt: tomorrow.toISOString(),
    };
  }

  return {
    allowed: true,
    used,
    remaining: maxUploads - used,
    resetsAt: '',
  };
}

/**
 * Increment media upload count
 */
export async function incrementMediaUpload(userId: string): Promise<number> {
  const today = new Date().toISOString().split('T')[0];
  const key = `hushh-ai:media-limit:${userId}:${today}`;
  
  const newCount = await executeCommand<number>(['INCR', key]);
  
  // Set expiry to end of day (24 hours from now as fallback)
  await executeCommand(['EXPIRE', key, '86400']);
  
  return newCount || 1;
}

// ============================================
// Caching
// ============================================

/**
 * Cache chat context for faster retrieval
 */
export async function cacheContext(
  chatId: string,
  context: { role: string; content: string }[],
  ttlSeconds: number = 3600 // 1 hour
): Promise<void> {
  const key = `hushh-ai:context:${chatId}`;
  await executeCommand(['SET', key, JSON.stringify(context), 'EX', String(ttlSeconds)]);
}

/**
 * Get cached chat context
 */
export async function getCachedContext(chatId: string): Promise<{ role: string; content: string }[] | null> {
  const key = `hushh-ai:context:${chatId}`;
  const cached = await executeCommand<string>(['GET', key]);
  
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Cache AI response for similar queries (semantic caching placeholder)
 */
export async function cacheResponse(
  queryHash: string,
  response: string,
  ttlSeconds: number = 1800 // 30 minutes
): Promise<void> {
  const key = `hushh-ai:response:${queryHash}`;
  await executeCommand(['SET', key, response, 'EX', String(ttlSeconds)]);
}

/**
 * Get cached AI response
 */
export async function getCachedResponse(queryHash: string): Promise<string | null> {
  const key = `hushh-ai:response:${queryHash}`;
  return await executeCommand<string>(['GET', key]);
}

// ============================================
// Session Management
// ============================================

/**
 * Store user session data
 */
export async function setSession(
  userId: string,
  sessionData: Record<string, unknown>,
  ttlSeconds: number = 86400 // 24 hours
): Promise<void> {
  const key = `hushh-ai:session:${userId}`;
  await executeCommand(['SET', key, JSON.stringify(sessionData), 'EX', String(ttlSeconds)]);
}

/**
 * Get user session data
 */
export async function getSession(userId: string): Promise<Record<string, unknown> | null> {
  const key = `hushh-ai:session:${userId}`;
  const session = await executeCommand<string>(['GET', key]);
  
  if (session) {
    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Delete user session
 */
export async function deleteSession(userId: string): Promise<void> {
  const key = `hushh-ai:session:${userId}`;
  await executeCommand(['DEL', key]);
}

// ============================================
// Streaming State (for resumable streams)
// ============================================

/**
 * Save streaming state for resumable streams
 */
export async function saveStreamState(
  chatId: string,
  messageId: string,
  partialContent: string
): Promise<void> {
  const key = `hushh-ai:stream:${chatId}:${messageId}`;
  await executeCommand(['SET', key, partialContent, 'EX', '300']); // 5 min TTL
}

/**
 * Get streaming state
 */
export async function getStreamState(chatId: string, messageId: string): Promise<string | null> {
  const key = `hushh-ai:stream:${chatId}:${messageId}`;
  return await executeCommand<string>(['GET', key]);
}

/**
 * Clear streaming state
 */
export async function clearStreamState(chatId: string, messageId: string): Promise<void> {
  const key = `hushh-ai:stream:${chatId}:${messageId}`;
  await executeCommand(['DEL', key]);
}

// ============================================
// Analytics (simple counters)
// ============================================

/**
 * Increment usage counter for analytics
 */
export async function trackUsage(metric: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const key = `hushh-ai:analytics:${metric}:${today}`;
  await executeCommand(['INCR', key]);
  await executeCommand(['EXPIRE', key, '604800']); // Keep for 7 days
}

/**
 * Get usage count
 */
export async function getUsageCount(metric: string, date?: string): Promise<number> {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const key = `hushh-ai:analytics:${metric}:${targetDate}`;
  const count = await executeCommand<number>(['GET', key]);
  return count || 0;
}

// ============================================
// Simple hash function for query caching
// ============================================

export function hashQuery(query: string): string {
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    const char = query.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}
