import { Message } from '@entities/message';
import { GetAllRepository } from '@use-cases/interfaces/repository';
import { UseCaseInputPort } from '@use-cases/interfaces/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/use-case-output-port';
import { RetrieveMessagesResponse } from './dtos/response';

type Dependencies = {
  presenter: UseCaseOutputPort<RetrieveMessagesResponse>;
  messagesRepo: GetAllRepository<Message>;
};

export class RetrieveMessagesUseCase implements UseCaseInputPort<void> {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(): Promise<void> {
    const { messagesRepo, presenter } = this.dependencies;
    const messages = await messagesRepo.getAll();

    return presenter.success({
      messages: messages.map((message) => ({
        postedAt: message.postedAt,
        text: message.text,
        username: message.username,
      })),
    });
  }
}
