import { ErrorLogger } from "@interface-adapters/interfaces/logger";
import { RegisterUserController } from "@interface-adapters/register-user/register-user.controller";
import { InternalServerError } from "@interface-adapters/shared/errors/internal-server-error";
import { MissingRequiredFieldError } from "@interface-adapters/shared/errors/missing-required-field-error";
import { HttpRequest } from "@interface-adapters/shared/http-request";
import { getMock } from "@test/test-utils/get-mock";
import { UseCaseInputPort } from "@use-cases/interfaces/use-case-input-port";
import { UseCaseOutputPort } from "@use-cases/interfaces/use-case-output-port";
import faker from 'faker';

describe('Register user http controller tests', () => {
  const logger = getMock<ErrorLogger>(['log']);
  const useCase = getMock<UseCaseInputPort<any>>(['execute']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure']);
  const sut = new RegisterUserController({ logger, useCase, presenter });

  it('should verify if the name is missing.', async () => {
    const request = new HttpRequest({
      body: { 
        email: faker.internet.email(),
        password: faker.internet.password() 
      },
    });
    await sut.handle(request);
    expect(presenter.failure).toBeCalledWith(new MissingRequiredFieldError('name'));
  });

  it('should verify if the email is missing.', async () => {
    const request = new HttpRequest({
      body: { 
        name: faker.name.findName(),
        password: faker.internet.password()
      },
    });
    await sut.handle(request);
    expect(presenter.failure).toBeCalledWith(new MissingRequiredFieldError('email'));
  });

  it('should verify if the password is missing.', async () => {
    const request = new HttpRequest({
      body: { 
        name: faker.name.findName(),
        email: faker.internet.email(),
      },
    });
    await sut.handle(request);
    expect(presenter.failure).toBeCalledWith(new MissingRequiredFieldError('password'));
  });

  it('should pass the name, email and password to the use case.', async () => {
    const name = faker.name.findName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const request = new HttpRequest({ body: { name, email, password }});
    await sut.handle(request);
    expect(useCase.execute).toBeCalledWith({ name, email, password });
  });

  it('should log if any error occurs.', async () => {
    const error = new Error('Woops!');
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(error);
    const request = new HttpRequest({
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    });
    await sut.handle(request);
    expect(presenter.failure).toBeCalledWith(new InternalServerError());
    expect(logger.log).toBeCalledWith(error);
  });
})