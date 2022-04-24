import { MessageHandlers } from "@infra/express/routes/message.routes";
import { postMessageHandler } from '@infra/express/handlers/post-message.handler'
import { JWTAuthService } from "@infra/implementations/jwt-auth-service";
import { UUIDv4IdGenerator } from "@infra/implementations/uuid-v4-id-generator";
import { ConsoleErrorLogger } from "@infra/implementations/console-error-logger";
import { MessagesInMemoryRepository } from "@infra/database/in-memory/messages-in-memory-repository";
import { retrieveMessagesHandler } from "@infra/express/handlers/retrieve-messages.handler";
import { PrismaUserRepository } from "@infra/database/prisma/repositories/prisma-user-repository";
import { PrismaClient } from "@prisma/client";


export const makeMessageHandlers = (): MessageHandlers => {
  const authService = new JWTAuthService();
  const idGenerator = new UUIDv4IdGenerator();
  const logger = new ConsoleErrorLogger();
  const messagesRepo = MessagesInMemoryRepository.getInstance();
  const usersRepo = new PrismaUserRepository(new PrismaClient());

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