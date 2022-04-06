import { UserInMemoryRepository } from "@infra/database/user-in-memory-repository";
import { registerUserHandler } from "@infra/express/handlers/register-user.handlers";
import { UserHandlers } from "@infra/express/routes/user.routes";
import { ConsoleErrorLogger } from "@infra/implementations/console-error-logger";
import { EmailValidatorImpl } from "@infra/implementations/email-validator-impl";
import { NodeMailerEmailSender } from "@infra/implementations/nodemailer-email-sender";
import { UUIDv4IdGenerator } from "@infra/implementations/uuid-v4-id-generator";

export const makeUserHandlers = (): UserHandlers => {
  const repository = UserInMemoryRepository.getInstance();
  const emailSender = new NodeMailerEmailSender();
  const emailValidator = new EmailValidatorImpl();
  const logger = new ConsoleErrorLogger();
  const idGenerator = new UUIDv4IdGenerator();

  const register = registerUserHandler({
    emailSender, 
    emailValidator,
    repository, 
    logger,
    idGenerator
  })

  return {
    register,
  }
}