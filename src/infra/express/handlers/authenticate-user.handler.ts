import { AuthenticateUserController } from "@interface-adapters/authenticate-user/authenticate-user.controller";
import { ErrorLogger } from "@interface-adapters/interfaces/logger";
import { AuthenticateUseCase } from "@use-cases/authenticate";
import { AuthenticationService } from "@use-cases/authenticate/dependencies/authentication-service.interface";
import { GetByEmailRepository } from "@use-cases/authenticate/dependencies/get-by-email-repository.interface";
import { PasswordEncrypter } from "@use-cases/interfaces/password-encrypter.interface";
import { Request, Response } from "express";
import { parseToHttpRequest } from "../helpers/parse-http-request";
import { AuthenticateUserPresenter } from "../presenters/authenticate-user.presenter";

interface Dependencies {
  logger: ErrorLogger;
  repository: GetByEmailRepository;
  encrypter: PasswordEncrypter;
  authService: AuthenticationService;
}

export const authenticateUserHandler = (dependencies: Dependencies) => (req: Request, res: Response) => {
  const { logger, repository, encrypter, authService } = dependencies;
  const presenter = new AuthenticateUserPresenter(res);
  const useCase = new AuthenticateUseCase({
    authService,
    encrypter,
    presenter,
    repository
  });
  const controller = new AuthenticateUserController({ logger, presenter, useCase });
  controller.handle(parseToHttpRequest(req));
}