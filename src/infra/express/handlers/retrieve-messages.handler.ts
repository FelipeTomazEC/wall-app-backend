import { Message } from "@entities/message"
import { ErrorLogger } from "@interface-adapters/interfaces/logger";
import { RetrieveMessagesController } from "@interface-adapters/retrieve-messages/retrieve-messages.controller";
import { GetAllRepository } from "@use-cases/interfaces/repository"
import { RetrieveMessagesUseCase } from "@use-cases/retrieve-messages";
import { Request, Response } from "express";
import { parseToHttpRequest } from "../helpers/parse-http-request";
import { RetrieveMessagesPresenter } from "../presenters/retrieve-messages.presenter";

type Dependencies = {
  messagesRepo: GetAllRepository<Message>;
  logger: ErrorLogger;
}

export const retrieveMessagesHandler = (dependencies: Dependencies) => (req: Request, res: Response) => {
  const { messagesRepo, logger } = dependencies;
  const presenter = new RetrieveMessagesPresenter(res);
  const useCase = new RetrieveMessagesUseCase({ messagesRepo, presenter });
  const controller = new RetrieveMessagesController({ presenter, logger, useCase});
  controller.handle(parseToHttpRequest(req));
}