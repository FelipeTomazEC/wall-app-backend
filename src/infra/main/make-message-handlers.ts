import { MessageHandlers } from "@infra/express/routes/message.routes";
import { postMessageHandler } from '@infra/express/handlers/post-message.handler'
import { JWTAuthService } from "@infra/implementations/jwt-auth-service";
import { UUIDv4IdGenerator } from "@infra/implementations/uuid-v4-id-generator";
import { ConsoleErrorLogger } from "@infra/implementations/console-error-logger";
import { MessagesInMemoryRepository } from "@infra/database/messages-in-memory-repository";
import { UserInMemoryRepository } from "@infra/database/user-in-memory-repository";
import { retrieveMessagesHandler } from "@infra/express/handlers/retrieve-messages.handler";


export const makeMessageHandlers = (): MessageHandlers => {
  const authService = new JWTAuthService();
  const idGenerator = new UUIDv4IdGenerator();
  const logger = new ConsoleErrorLogger();
  const messagesRepo = MessagesInMemoryRepository.getInstance();
  const usersRepo = UserInMemoryRepository.getInstance();

  const postMessage = postMessageHandler({
    authService,
    idGenerator,
    logger,
    messagesRepo,
    usersRepo
  });

  const getAll = retrieveMessagesHandler({
    logger,
    messagesRepo
  })

  return { postMessage, getAll };
}