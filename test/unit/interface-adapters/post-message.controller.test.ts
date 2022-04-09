import { ErrorLogger } from "@interface-adapters/interfaces/logger";
import { PostMessageController } from "@interface-adapters/post-message/post-message.controller";
import { InternalServerError } from "@interface-adapters/shared/errors/internal-server-error";
import { MissingRequiredFieldError } from "@interface-adapters/shared/errors/missing-required-field-error";
import { HttpRequest } from "@interface-adapters/shared/http-request";
import { getMock } from "@test/test-utils/get-mock";
import { getNullAsType } from "@test/test-utils/get-nullable-as-type";
import { UseCaseOutputPort } from "@use-cases/interfaces/use-case-output-port";
import { PostMessageUseCase } from "@use-cases/post-message";
import faker from "faker";

describe('Post message http controller tests', () => {
  const logger = getMock<ErrorLogger>(['log']);
  const useCase = getMock<PostMessageUseCase>(['execute']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure']);
  const sut = new PostMessageController({ logger, presenter, useCase});

  it('should validate if the message text is missing', async () => {
    const token = faker.git.commitSha();
    const message = getNullAsType<string>();
    const request = new HttpRequest({
      headers: [{ name: 'Authorization', value: `Bearer ${token}`}],
      body: { message }
    });
    await sut.handle(request);
    expect(presenter.failure).toBeCalledWith(new MissingRequiredFieldError('message'));
  });

  it('should pass the message text and the token to the use case', async () => {
    const token = faker.git.commitSha();
    const message = faker.random.words();
    const request = new HttpRequest({
      headers: [{ name: 'Authorization', value: `Bearer ${token}`}],
      body: { message }
    });
    await sut.handle(request);
    expect(useCase.execute).toBeCalledWith({ token, text: message });
  });
  
  it('should log if any error occurs.', async () => {
    const error = new Error('Woops!');
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(error);
    const request = new HttpRequest({
      headers: [{
        name: 'Authorization',
        value: `Bearer ${faker.git.commitSha()}`
      }],
      body: {
        message: faker.random.words(),
      }
    });
    await sut.handle(request);
    expect(presenter.failure).toBeCalledWith(new InternalServerError());
    expect(logger.log).toBeCalledWith(error);
  });
})