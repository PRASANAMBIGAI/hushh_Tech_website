/**
 * Message Entity
 * Pure business object with NO dependencies on React or Supabase
 */
export type MessageRole = 'user' | 'assistant';

export class Message {
  constructor(
    public readonly id: string,
    public readonly chatId: string,
    public readonly role: MessageRole,
    public readonly content: string,
    public readonly mediaUrls: string[],
    public readonly createdAt: Date
  ) {}

  isFromUser(): boolean {
    return this.role === 'user';
  }

  isFromAssistant(): boolean {
    return this.role === 'assistant';
  }

  hasMedia(): boolean {
    return this.mediaUrls.length > 0;
  }

  getWordCount(): number {
    return this.content.split(/\s+/).filter(word => word.length > 0).length;
  }

  getCharacterCount(): number {
    return this.content.length;
  }
}
