import { Message } from "@entities/message";
import { PrismaClient } from "@prisma/client";
import { SaveRepository, GetAllRepository } from "@use-cases/interfaces/repository";

export class PrismaMessageRepository
  implements SaveRepository<Message>, GetAllRepository<Message> {

  constructor(private readonly client: PrismaClient) { }

  async getAll(): Promise<Message[]> {
    const messagesData = await this.client.message.findMany({
      include: { postedBy: true },
    });

    const messages = messagesData.map(data => new Message({
      id: data.id,
      postedAt: data.postedAt,
      text: data.text,
      userId: data.postedBy.id,
      username: data.postedBy.name
    }));

    this.client.$disconnect();

    return messages; 
  }

  async save(entity: Message): Promise<void> {
    await this.client.message.create({
      data: {
        id: entity.id,
        text: entity.text,
        postedAt: entity.postedAt,
        userId: entity.userId
      }
    });

    this.client.$disconnect();
  }
}