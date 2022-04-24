import { HttpStatusCode } from '@interface-adapters/shared/http-status-code';
import { UseCaseOutputPort } from '@use-cases/interfaces/use-case-output-port';
import { RetrieveMessagesResponse as Response } from '@use-cases/retrieve-messages/dtos/response';
import { Response as ExpressResponse } from 'express';

export class RetrieveMessagesPresenter implements UseCaseOutputPort<Response> {
  constructor(private readonly expressResponse: ExpressResponse) {}

  async failure(error: Error): Promise<void> {
    this.expressResponse.status(HttpStatusCode.SERVER_ERROR).json({
      error: {
        message: error.message,
      },
    });
  }

  async success(response: Response): Promise<void> {
    this.expressResponse.status(HttpStatusCode.OK).json(response);
  }
}
