import { HttpStatusCode } from '@interface-adapters/shared/http-status-code';
import { getMock } from '@test/test-utils/get-mock';
import { RegisterUserResponse } from '@use-cases/register-user/dtos/response';
import { EmailAlreadyRegisteredError } from '@use-cases/register-user/errors/email-already-registered-error';
import { InvalidEmailError } from '@use-cases/register-user/errors/invalid-email-error';
import { Response } from 'express';
import { RegisterUserPresenter } from '@infra/express/presenters/register-user.presenter';
import faker from 'faker';

describe('Register user presenter tests', () => {
  const expressResponse = getMock<Response>(['status', 'json']);
  jest.spyOn(expressResponse, 'status').mockReturnThis();
  const sut = new RegisterUserPresenter(expressResponse);

  it('should map an invalid email error to a bad request', () => {
    const error = new InvalidEmailError('some-email');
    sut.failure(error);
    expect(expressResponse.status).toBeCalledWith(HttpStatusCode.BAD_REQUEST);
    expect(expressResponse.json).toBeCalledWith({
      error: {
        message: error.message,
      },
    });
  });

  it('should map email already registered error to conflict', () => {
    const error = new EmailAlreadyRegisteredError(faker.internet.email());
    sut.failure(error);
    expect(expressResponse.status).toBeCalledWith(HttpStatusCode.CONFLICT);
    expect(expressResponse.json).toBeCalledWith({
      error: {
        message: error.message,
      },
    });
  });

  it('should map any other error to internal server error', () => {
    const error = new Error('some error message');
    sut.failure(error);
    expect(expressResponse.status).toBeCalledWith(HttpStatusCode.SERVER_ERROR);
    expect(expressResponse.json).toBeCalledWith({
      error: {
        message: error.message,
      },
    });
  });

  it('should send the response with status code 201', () => {
    const response: RegisterUserResponse = {
      id: faker.datatype.uuid(),
    };

    sut.success(response);
    expect(expressResponse.status).toBeCalledWith(
      HttpStatusCode.RESOURCE_CREATED,
    );
    expect(expressResponse.json).toBeCalledWith(response);
  });
});
