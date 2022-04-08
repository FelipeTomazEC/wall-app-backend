import { User } from "@entities/user";
import { SaveRepository } from "@use-cases/interfaces/repository";
import { UseCaseInputPort } from "../interfaces/use-case-input-port";
import { UseCaseOutputPort } from "../interfaces/use-case-output-port";
import { EmailExistsRepository } from "./dependencies/email-exists-repository.interface";
import { EmailSender, SendEmailArgs } from "./dependencies/email-sender.interface";
import { EmailValidator } from "./dependencies/email-validator.interface";
import { IdGenerator } from "./dependencies/id-generator.interface";
import { PasswordEncrypter } from "../interfaces/password-encrypter.interface";
import { RegisterUserRequest as Request } from "./dtos/request";
import { RegisterUserResponse as Response } from "./dtos/response";
import { EmailAlreadyRegisteredError } from "./errors/email-already-registered-error";
import { InvalidEmailError } from "./errors/invalid-email-error";
import { getWelcomeEmailContent } from "./utils/get-welcome-email-content";

type Dependencies = {
  presenter: UseCaseOutputPort<Response>;
  repository: EmailExistsRepository & SaveRepository<User>;
  emailSender: EmailSender;
  emailValidator: EmailValidator;
  idGenerator: IdGenerator;
  encrypter: PasswordEncrypter;
}

export class RegisterUserUseCase implements UseCaseInputPort<Request> {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(request: Request): Promise<void> {
    const { repository, presenter, emailValidator } = this.dependencies;
    const { idGenerator, emailSender, encrypter } = this.dependencies;
    const { email, name } = request;

    const isEmailValid = emailValidator.isValid(email);
    if(!isEmailValid) {
      return presenter.failure(new InvalidEmailError(email));
    }

    const isEmailAlreadyRegistered = await repository.emailExists(email);
    if(isEmailAlreadyRegistered) {
      return presenter.failure(new EmailAlreadyRegisteredError(email));
    }

    const password = await encrypter.encrypt(request.password);
    const id = await idGenerator.generate();
    const user = new User({ email, name, id, password });
    await repository.save(user);

    const welcomeEmail: SendEmailArgs = {
      content: getWelcomeEmailContent(name),
      subject: 'Welcome to the Wallboard community',
      to: email
    }

    await emailSender.sendEmail(welcomeEmail);

    return presenter.success({ id });
  }
}