/**
 * Hushh AI - Core Types
 * Fresh build for Free AI Assistant
 */

// ============================================
// User Types
// ============================================

export interface HushhAIUser {
  id: string;
  supabaseUserId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  lastLoginAt: Date;
  totalMessages: number;
  totalChats: number;
  isActive: boolean;
}

// ============================================
// Chat Types
// ============================================

export interface HushhChat {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

// ============================================
// Message Types
// ============================================

export type MessageRole = 'user' | 'assistant';

export interface CalendarEventMetadata {
  id: string;
  summary: string;
  startTime: string;
  endTime: string;
  description?: string;
  location?: string;
  meetLink?: string;
  htmlLink?: string;
  attendees?: string[];
}

export interface MessageMetadata {
  calendarEvent?: CalendarEventMetadata;
  // Future metadata types can be added here as specific fields
  // fileAttachment?: FileMetadata;
  // voiceNote?: VoiceMetadata;
}

// Runtime validation helper for calendar metadata
export function validateCalendarMetadata(data: unknown): CalendarEventMetadata | null {
  if (!data || typeof data !== 'object') return null;

  const event = data as Record<string, unknown>;

  // Required fields validation
  if (
    typeof event.id !== 'string' ||
    typeof event.summary !== 'string' ||
    typeof event.startTime !== 'string' ||
    typeof event.endTime !== 'string'
  ) {
    return null;
  }

  // Validate date formats
  if (isNaN(Date.parse(event.startTime)) || isNaN(Date.parse(event.endTime))) {
    return null;
  }

  // Optional fields validation
  if (event.description !== undefined && typeof event.description !== 'string') {
    return null;
  }

  if (event.location !== undefined && typeof event.location !== 'string') {
    return null;
  }

  if (event.meetLink !== undefined && typeof event.meetLink !== 'string') {
    return null;
  }

  if (event.htmlLink !== undefined && typeof event.htmlLink !== 'string') {
    return null;
  }

  if (event.attendees !== undefined && !Array.isArray(event.attendees)) {
    return null;
  }

  return event as unknown as CalendarEventMetadata;
}

export interface HushhMessage {
  id: string;
  chatId: string;
  role: MessageRole;
  content: string;
  mediaUrls: string[];
  createdAt: Date;
  metadata?: MessageMetadata;
}

export interface StreamingMessage {
  content: string;
  isComplete: boolean;
}

// ============================================
// Media Types
// ============================================

export interface MediaFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  thumbnailUrl?: string;
}

export interface MediaLimits {
  dailyUploads: number;
  maxDailyUploads: number;
  remainingUploads: number;
  lastReset: Date;
}

// ============================================
// AI Request/Response Types
// ============================================

export interface AIRequest {
  message: string;
  chatId?: string;
  mediaUrls?: string[];
}

export interface AIResponse {
  content: string;
  chatId: string;
  messageId: string;
}

export interface AIStreamChunk {
  text: string;
  isComplete: boolean;
  error?: string;
}

// ============================================
// UI State Types
// ============================================

export interface ChatState {
  isTyping: boolean;
  isSending: boolean;
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;
}

export interface SidebarState {
  isOpen: boolean;
  isLoading: boolean;
  chats: HushhChat[];
}
