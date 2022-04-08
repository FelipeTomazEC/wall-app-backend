import { AuthenticateUserController } from "@interface-adapters/authenticate-user/authenticate-user.controller";
import { ErrorLogger } from "@interface-adapters/interfaces/logger";
import { InternalServerError } from "@interface-adapters/shared/errors/internal-server-error";
import { MissingRequiredFieldError } from "@interface-adapters/shared/errors/missing-required-field-error";
import { HttpRequest } from "@interface-adapters/shared/http-request";
import { getMock } from "@test/test-utils/get-mock";
import { UseCaseInputPort } from '@use-cases/interfaces/use-case-input-port';
import { UseCaseOutputPort } from "@use-cases/interfaces/use-case-output-port";
import faker from 'faker';

describe('Authenticate user http controller tests', () => {
  const useCase = getMock<UseCaseInputPort<any>>(['execute']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure']);
  const logger = getMock<ErrorLogger>(['log']);
  const sut = new AuthenticateUserController({ useCase, presenter, logger });
  
  it('should verify if the email is missing.', async () => {
    const request = new HttpRequest({
      body: {
        password: faker.internet.password()
      }
    });
    await sut.handle(request);
    expect(presenter.failure).toBeCalledWith(new MissingRequiredFieldError('email'));
  });

  it('should verify if the password is missing.', async () => {
    const request = new HttpRequest({
      body: {
        email: faker.internet.email()
      }
    });
    await sut.handle(request);
    expect(presenter.failure).toBeCalledWith(new MissingRequiredFieldError('password'));
  });

  it('should verify if the pass the email and password to the use case.', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const request = new HttpRequest({ body: { email, password } });
    await sut.handle(request);
    expect(useCase.execute).toBeCalledWith({ email, password });
  });

  it('should log if any error occurs.', async () => {
    const error = new Error('Woops!');
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(error);
    const request = new HttpRequest({
      body: {
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    });
    await sut.handle(request);
    expect(presenter.failure).toBeCalledWith(new InternalServerError());
    expect(logger.log).toBeCalledWith(error);
  });
});
