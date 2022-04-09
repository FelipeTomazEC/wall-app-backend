import { ErrorLogger } from "@interface-adapters/interfaces/logger";
import { RetrieveMessagesController } from "@interface-adapters/retrieve-messages/retrieve-messages.controller";
import { InternalServerError } from "@interface-adapters/shared/errors/internal-server-error";
import { HttpRequest } from "@interface-adapters/shared/http-request";
import { getMock } from "@test/test-utils/get-mock";
import { UseCaseInputPort } from "@use-cases/interfaces/use-case-input-port";
import { UseCaseOutputPort } from "@use-cases/interfaces/use-case-output-port";

describe('Retrieve messages http controller tests', () => {
  const presenter = getMock<UseCaseOutputPort<any>>(['failure']);
  const logger = getMock<ErrorLogger>(['log']);
  const useCase = getMock<UseCaseInputPort<any>>(['execute']);
  const sut = new RetrieveMessagesController({ presenter, logger, useCase });

  it('should call the use case', async () => {
    await sut.handle(new HttpRequest({}));
    expect(useCase.execute).toBeCalled();
  });

  it('should log if any error occurs.', async () => {
    const error = new Error('Woops!');
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(error);
    await sut.handle(new HttpRequest({}));
    expect(presenter.failure).toBeCalledWith(new InternalServerError());
    expect(logger.log).toBeCalledWith(error);
  });
})