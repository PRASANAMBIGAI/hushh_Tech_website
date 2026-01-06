# Calendar Card Fix - Deployment Guide

## Problem
Calendar events in Hushh AI were showing as raw markdown text instead of rendering the beautiful CalendarEventCard component.

## Solution Applied

### 1. Code Changes Completed ✅

**src/hushh-ai/services/hushhAIService.ts:**
- Added `metadata` parameter to `addMessage` function
- Updated `DbMessage` interface with `metadata` field
- Updated `mapMessage` to include metadata in returned objects

**src/hushh-ai/pages/index.tsx:**
- Imported `CalendarEventMetadata` and `MessageMetadata` types
- Fixed type safety for calendar metadata parsing from response headers
- CalendarEventCard now renders properly when metadata contains calendar event

**src/hushh-ai/core/types/index.ts:**
- Already had proper type definitions for `CalendarEventMetadata` and `MessageMetadata`

**supabase/functions/hushh-ai-chat/index.ts:**
- Already returns calendar metadata in `X-Calendar-Event-Data` header

### 2. Edge Function Deployed ✅
```bash
npx supabase functions deploy hushh-ai-chat --no-verify-jwt
```
Output: "Deployed Functions on project ibsisfnjxeowvdtvgzff: hushh-ai-chat"

### 3. Database Migration Required ⚠️

Run this SQL in Supabase Dashboard SQL Editor:
https://supabase.com/dashboard/project/ibsisfnjxeowvdtvgzff/sql/new

```sql
-- Add metadata column for storing calendar events and other structured data
ALTER TABLE hushh_ai_messages 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT NULL;

-- Add index for querying messages with specific metadata
CREATE INDEX IF NOT EXISTS idx_hushh_ai_messages_metadata 
  ON hushh_ai_messages USING GIN (metadata) 
  WHERE metadata IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN hushh_ai_messages.metadata IS 'Stores structured metadata like calendar events, file info, etc.';
```

## How It Works Now

1. User asks to schedule a meeting (e.g., "schedule a meet with ankit@hushh.ai for tomorrow 2 PM")
2. Edge function detects calendar intent and creates event via Google Calendar API
3. Response headers include calendar event metadata
4. Frontend reads `X-Calendar-Event-Data` header
5. Message is saved with calendar metadata
6. MessageBubble component renders CalendarEventCard below the text

## Testing

After running the SQL migration:
1. Go to https://hushh.ai/hushh-ai
2. Login with Google OAuth
3. Type: "Schedule a meeting with test@example.com tomorrow at 3 PM"
4. The AI should create the event and display a nice calendar card instead of raw markdown
