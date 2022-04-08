import { AuthenticateUserPresenter } from "@infra/express/presenters/authenticate-user.presenter";
import { MissingRequiredFieldError } from "@interface-adapters/shared/errors/missing-required-field-error";
import { HttpStatusCode } from "@interface-adapters/shared/http-status-code";
import { getMock } from "@test/test-utils/get-mock";
import { AuthenticateResponse } from "@use-cases/authenticate/dtos/response";
import { AuthenticationError } from "@use-cases/authenticate/errors/wrong-email-or-password-error";
import { Response } from 'express';
import faker from "faker";

describe('Authenticate user presenter tests', () => {
  const expressResponse = getMock<Response>(['status', 'json']);
  jest.spyOn(expressResponse, 'status').mockReturnThis();
  const sut = new AuthenticateUserPresenter(expressResponse);

  it('should map an authentication error to unauthorized', () => {
    const error = new AuthenticationError();
    sut.failure(error);
    expect(expressResponse.status).toBeCalledWith(HttpStatusCode.UNAUTHORIZED);
    expect(expressResponse.json).toBeCalledWith({
      error: {
        message: error.message
      }
    })
  });

  it('should map missing param errors to bad request', () => {
    const error = new MissingRequiredFieldError('field');
    sut.failure(error);
    expect(expressResponse.status).toBeCalledWith(HttpStatusCode.BAD_REQUEST);
    expect(expressResponse.json).toBeCalledWith({
      error: {
        message: error.message
      }
    })
  });

  it('should map any other error to internal server error', () => {
    const error = new Error('some error message');
    sut.failure(error);
    expect(expressResponse.status).toBeCalledWith(HttpStatusCode.SERVER_ERROR);
    expect(expressResponse.json).toBeCalledWith({
      error: {
        message: error.message
      }
    });
  });

  it('should send the response with status code 201', () => {
    const response: AuthenticateResponse = {
      token: faker.datatype.uuid()
    }
    sut.success(response);
    expect(expressResponse.status).toBeCalledWith(HttpStatusCode.OK);
    expect(expressResponse.json).toBeCalledWith(response);
  });
});