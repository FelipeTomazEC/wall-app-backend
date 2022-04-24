import { Message } from "@entities/message";
import { GetAllRepository, SaveRepository } from "@use-cases/interfaces/repository";

export class MessagesInMemoryRepository
  implements SaveRepository<Message>, GetAllRepository<Message> {
  private static instance: MessagesInMemoryRepository | null = null;

  private readonly messages: Message[];

  private constructor() {
    this.messages = [];
  }

  static getInstance(): MessagesInMemoryRepository {
    if (!this.instance) {
      this.instance = new MessagesInMemoryRepository();
    }

    return this.instance;
  }

  async save(message: Message): Promise<void> {
    this.messages.push(message);
  }

  async getAll(): Promise<Message[]> {
    return [...this.messages];
  }
}