import { PasswordEncrypter } from '@use-cases/interfaces/password-encrypter.interface';
import { UseCaseInputPort } from '@use-cases/interfaces/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/use-case-output-port';
import { AuthenticationService } from './dependencies/authentication-service.interface';
import { GetByEmailRepository } from './dependencies/get-by-email-repository.interface';
import { AuthenticateRequest as Request } from './dtos/request';
import { AuthenticateResponse as Response } from './dtos/response';
import { AuthenticationError } from './errors/wrong-email-or-password-error';

type Dependencies = {
  presenter: UseCaseOutputPort<Response>;
  repository: GetByEmailRepository;
  authService: AuthenticationService;
  encrypter: PasswordEncrypter;
};

export class AuthenticateUseCase implements UseCaseInputPort<Request> {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(request: Request): Promise<void> {
    const { repository, presenter, authService, encrypter } = this.dependencies;
    const { password, email } = request;
    const user = await repository.getByEmail(email);
    if (!user) {
      return presenter.failure(new AuthenticationError());
    }

    const isPasswordCorrect = await encrypter.verify(password, user.password);
    if (!isPasswordCorrect) {
      return presenter.failure(new AuthenticationError());
    }

    const credentials = await authService.generateTokenFor(user);

    return presenter.success(credentials);
  }
}
