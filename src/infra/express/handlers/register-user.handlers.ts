import { User } from '@entities/user';
import { ErrorLogger } from '@interface-adapters/interfaces/logger';
import { RegisterUserController } from '@interface-adapters/register-user/register-user.controller';
import { SaveRepository } from '@use-cases/interfaces/repository';
import { RegisterUserUseCase } from '@use-cases/register-user';
import { EmailExistsRepository } from '@use-cases/register-user/dependencies/email-exists-repository.interface';
import { EmailSender } from '@use-cases/register-user/dependencies/email-sender.interface';
import { EmailValidator } from '@use-cases/register-user/dependencies/email-validator.interface';
import { IdGenerator } from '@use-cases/register-user/dependencies/id-generator.interface';
import { Request, Response } from 'express';
import { parseToHttpRequest } from '../helpers/parse-http-request';
import { RegisterUserPresenter } from '../presenters/register-user.presenter';

interface Dependencies {
  logger: ErrorLogger;
  repository: SaveRepository<User> & EmailExistsRepository;
  emailSender: EmailSender;
  idGenerator: IdGenerator;
  emailValidator: EmailValidator;
}

export const registerUserHandler = (dependencies: Dependencies) => (req: Request, res: Response) => {
  const { logger, repository, emailSender, emailValidator } = dependencies;
  const { idGenerator } = dependencies;
  const presenter = new RegisterUserPresenter(res);
  const useCase = new RegisterUserUseCase({ 
    emailSender, 
    idGenerator, 
    emailValidator, 
    presenter, 
    repository 
  });
  const controller = new RegisterUserController({ logger, useCase, presenter });
  controller.handle(parseToHttpRequest(req));
}