import { Message } from '@entities/message';
import { User } from '@entities/user';
import { ErrorLogger } from '@interface-adapters/interfaces/logger';
import { PostMessageController } from '@interface-adapters/post-message/post-message.controller';
import { IdGenerator } from '@use-cases/interfaces/id-generator.interface';
import {
  GetByIdRepository,
  SaveRepository,
} from '@use-cases/interfaces/repository';
import { PostMessageUseCase } from '@use-cases/post-message';
import { AuthorizationService } from '@use-cases/post-message/dependencies/authorization-service.interface';
import { Request, Response } from 'express';
import { parseToHttpRequest } from '../helpers/parse-http-request';
import { PostMessagePresenter } from '../presenters/post-message.presenter';

type Dependencies = {
  logger: ErrorLogger;
  messagesRepo: SaveRepository<Message>;
  usersRepo: GetByIdRepository<User>;
  authService: AuthorizationService;
  idGenerator: IdGenerator;
};

export const postMessageHandler =
  (dependencies: Dependencies) => (req: Request, res: Response) => {
    const { authService, messagesRepo, usersRepo, idGenerator } = dependencies;
    const { logger } = dependencies;
    const presenter = new PostMessagePresenter(res);
    const useCase = new PostMessageUseCase({
      authService,
      idGenerator,
      messagesRepo,
      presenter,
      usersRepo,
    });
    const controller = new PostMessageController({
      logger,
      presenter,
      useCase,
    });
    controller.handle(parseToHttpRequest(req));
  };
