/**
 * Save AI Response Use Case
 * Saves the AI response after streaming is complete
 */
import { IMessageRepository } from '../../repositories';
import { Message } from '../../entities';
import { logger } from '../../../core/utils';

export class SaveAIResponseUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(chatId: string, content: string): Promise<Message> {
    try {
      logger.debug(`Saving AI response to chat ${chatId}`);

      const message = await this.messageRepository.add(
        chatId,
        'assistant',
        content
      );

      logger.info(`Saved AI message ${message.id} to chat ${chatId}`);
      return message;
    } catch (error) {
      logger.error('Error in SaveAIResponseUseCase', error as Error);
      throw error;
    }
  }
}
