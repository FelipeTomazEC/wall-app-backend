import { PostMessagePresenter } from '@infra/express/presenters/post-message.presenter';
import { MissingRequiredFieldError } from '@interface-adapters/shared/errors/missing-required-field-error';
import { HttpStatusCode } from '@interface-adapters/shared/http-status-code';
import { getMock } from '@test/test-utils/get-mock';
import { PostMessageResponse } from '@use-cases/post-message/dtos/response';
import { AuthorizationError } from '@use-cases/post-message/errors/authorization-error';
import { Response } from 'express';
import faker from 'faker';

describe('Post message presenter tests', () => {
  const expressResponse = getMock<Response>(['status', 'json']);
  jest.spyOn(expressResponse, 'status').mockReturnThis();
  const sut = new PostMessagePresenter(expressResponse);

  it('should map authorization error to a forbidden http status', () => {
    const error = new AuthorizationError();
    sut.failure(error);
    expect(expressResponse.status).toBeCalledWith(HttpStatusCode.FORBIDDEN);
    expect(expressResponse.json).toBeCalledWith({
      error: {
        message: error.message,
      },
    });
  });

  it('should map a missing param error to a bad request', () => {
    const error = new MissingRequiredFieldError('field');
    sut.failure(error);
    expect(expressResponse.status).toBeCalledWith(HttpStatusCode.BAD_REQUEST);
    expect(expressResponse.json).toBeCalledWith({
      error: {
        message: error.message,
      },
    });
  });

  it('should map a success call to http status 201(Resource created)', () => {
    const response: PostMessageResponse = {
      id: faker.datatype.uuid(),
    };
    sut.success(response);
    expect(expressResponse.status).toBeCalledWith(
      HttpStatusCode.RESOURCE_CREATED,
    );
    expect(expressResponse.json).toBeCalledWith(response);
  });

  it('should map an unexpected error to a internal server error (500)', () => {
    const error = new Error('some error message');
    sut.failure(error);
    expect(expressResponse.status).toBeCalledWith(HttpStatusCode.SERVER_ERROR);
    expect(expressResponse.json).toBeCalledWith({
      error: {
        message: error.message,
      },
    });
  });
});
