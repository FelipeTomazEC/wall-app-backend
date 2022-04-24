import { Message } from '@entities/message';
import { User } from '@entities/user';
import { IdGenerator } from '@use-cases/interfaces/id-generator.interface';
import {
  GetByIdRepository,
  SaveRepository,
} from '@use-cases/interfaces/repository';
import { UseCaseInputPort } from '@use-cases/interfaces/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/use-case-output-port';
import { AuthorizationService } from './dependencies/authorization-service.interface';
import { PostMessageRequest as Request } from './dtos/request';
import { PostMessageResponse } from './dtos/response';

type Dependencies = {
  authService: AuthorizationService;
  usersRepo: GetByIdRepository<User>;
  messagesRepo: SaveRepository<Message>;
  idGenerator: IdGenerator;
  presenter: UseCaseOutputPort<PostMessageResponse>;
};

export class PostMessageUseCase implements UseCaseInputPort<Request> {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(request: Request): Promise<void> {
    const { token, text } = request;
    const { authService, presenter, usersRepo } = this.dependencies;
    const { messagesRepo, idGenerator } = this.dependencies;

    const userIdOrError = await authService.authorize(token);
    if (userIdOrError.isFailure()) {
      return presenter.failure(userIdOrError.value);
    }

    const userId = userIdOrError.value;
    const user = (await usersRepo.getById(userId)) as User;
    const messageId = await idGenerator.generate();
    const message = new Message({
      id: messageId,
      postedAt: new Date(Date.now()),
      text,
      userId,
      username: user.name,
    });

    await messagesRepo.save(message);

    return presenter.success({ id: message.id });
  }
}
