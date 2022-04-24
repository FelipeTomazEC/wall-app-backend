import { RetrieveMessagesPresenter } from '@infra/express/presenters/retrieve-messages.presenter';
import { HttpStatusCode } from '@interface-adapters/shared/http-status-code';
import { getMock } from '@test/test-utils/get-mock';
import { RetrieveMessagesResponse } from '@use-cases/retrieve-messages/dtos/response';
import { Response } from 'express';
import faker from 'faker';

describe('Retrieve messages presenter tests', () => {
  const expressResponse = getMock<Response>(['status', 'json']);
  jest.spyOn(expressResponse, 'status').mockReturnThis();
  const sut = new RetrieveMessagesPresenter(expressResponse);

  it('should return http status ok (200) for successful calls.', () => {
    const response: RetrieveMessagesResponse = {
      messages: [
        {
          postedAt: new Date(),
          text: faker.random.words(),
          username: faker.name.findName(),
        },
        {
          postedAt: new Date(),
          text: faker.random.words(),
          username: faker.name.findName(),
        },
      ],
    };

    sut.success(response);
    expect(expressResponse.status).toBeCalledWith(HttpStatusCode.OK);
    expect(expressResponse.json).toBeCalledWith(response);
  });

  it('should return internal server error (500) for unsuccessful calls.', () => {
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
