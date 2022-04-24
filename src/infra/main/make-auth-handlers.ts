import { PrismaUserRepository } from '@infra/database/prisma/repositories/prisma-user-repository';
import { authenticateUserHandler } from '@infra/express/handlers/authenticate-user.handler';
import { AuthHandlers } from '@infra/express/routes/auth.routes';
import { BcryptPasswordEncrypter } from '@infra/implementations/bcrypt-password-encrypter';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';
import { PrismaClient } from '@prisma/client';

export const makeAuthHandlers = (): AuthHandlers => {
  const repository = new PrismaUserRepository(new PrismaClient());
  const logger = new ConsoleErrorLogger();
  const encrypter = new BcryptPasswordEncrypter();
  const authService = new JWTAuthService();

  const authenticate = authenticateUserHandler({
    repository,
    logger,
    encrypter,
    authService,
  });

  return { authenticate };
};
