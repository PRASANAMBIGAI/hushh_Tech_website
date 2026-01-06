# Hushh AI Deployment Guide

## ✅ Deployment Status: SUCCESS

**Hushh AI** is now live and working with Vertex AI (Gemini 2.0 Flash) backend!

---

## 🚀 Quick Test

```bash
curl -X POST "https://ibsisfnjxeowvdtvgzff.supabase.co/functions/v1/hushh-ai-chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "chatId": "my-chat-123"}'
```

---

## 📁 Files Created

### Edge Function
- `supabase/functions/hushh-ai-chat/index.ts` - Main Edge Function with Vertex AI
- `supabase/functions/hushh-ai-chat/redis.ts` - Redis integration for rate limiting & caching
- `supabase/functions/hushh-ai-chat/deno.json` - Deno configuration

### Frontend
- `src/hushh-ai/pages/index.tsx` - Claude-style chat UI
- `src/hushh-ai/services/hushhAIService.ts` - Frontend service
- `src/hushh-ai/core/types/index.ts` - TypeScript types
- `src/hushh-ai/core/constants/index.ts` - Constants

### Database
- `supabase/migrations/20260106000000_create_hushh_ai_tables.sql` - Database tables

---

## 🔑 Secrets Configured

| Secret | Description | Status |
|--------|-------------|--------|
| `UPSTASH_REDIS_REST_URL` | Redis URL | ✅ Set |
| `UPSTASH_REDIS_REST_TOKEN` | Redis token | ✅ Set |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | GCP credentials | ✅ Set |

---

## ⚙️ Configuration

- **GCP Project:** `hushone-app`
- **Model:** `gemini-2.0-flash-001`
- **Region:** `us-central1`
- **Service Account:** `hushh-ai-vertex@hushone-app.iam.gserviceaccount.com`

---

## 🎯 Features

1. **Free AI Chat** - Unlimited messages for all users
2. **Rate Limiting** - 100 requests/minute via Redis
3. **Media Uploads** - 20 uploads/day limit
4. **Response Caching** - 30-minute cache for similar queries
5. **Context Memory** - 1-hour context caching per chat
6. **White-labeled** - Always refers to itself as "Hushh" (never Gemini/Google)

---

## 🧪 Test Results

**Test 1: Basic greeting**
```
Input: "Say hello"
Output: "Hello! It's a pleasure to meet you. I'm Hushh. I'm ready to assist you with anything you need."
```

**Test 2: Capabilities**
```
Input: "What can you help me with?"
Output: Lists writing, analysis, coding, general questions, creative tasks with markdown formatting
```

---

## 🔧 Technical Details

### JWT Authentication Fix
The Edge Function uses custom JWT signing with base64url encoding (RFC 7519) to authenticate with GCP:

```typescript
function base64url(input: string | ArrayBuffer): string {
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
```

### API Request Format
```typescript
{
  message: string;       // Required: User message
  chatId: string;        // Required: Chat session ID
  userId?: string;       // Optional: For rate limiting
  mediaUrls?: string[];  // Optional: Media file URLs
  history?: ChatMessage[]; // Optional: Conversation history
}
```

---

## 📊 Redis Integration

- **Rate Limiting:** 100 requests/minute per user
- **Response Cache:** 30-minute TTL
- **Context Cache:** 1-hour TTL (last 20 messages)
- **Usage Analytics:** Tracks requests, cache hits, errors

---

## 🌐 Endpoint

**Production URL:**
```
https://ibsisfnjxeowvdtvgzff.supabase.co/functions/v1/hushh-ai-chat
```

---

## 📝 Notes

- Edge Function uses non-streaming mode for reliability
- Streaming can be re-enabled by switching to `streamGenerateContent` endpoint
- All responses are cached to reduce API costs
- The AI never mentions it's powered by Google/Gemini

---

*Last Updated: January 6, 2026*
