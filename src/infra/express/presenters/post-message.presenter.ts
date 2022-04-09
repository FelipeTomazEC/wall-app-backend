import { MissingRequiredFieldError } from "@interface-adapters/shared/errors/missing-required-field-error";
import { HttpStatusCode } from "@interface-adapters/shared/http-status-code";
import { UseCaseOutputPort } from "@use-cases/interfaces/use-case-output-port";
import { PostMessageResponse as Response } from "@use-cases/post-message/dtos/response";
import { AuthorizationError } from "@use-cases/post-message/errors/authorization-error";
import { Response as ExpressResponse } from 'express';

export class PostMessagePresenter implements UseCaseOutputPort<Response> {
  constructor(private readonly res: ExpressResponse) {}

  async failure(error: Error): Promise<void> {
    const errorMap = new Map<string, HttpStatusCode>([
      [AuthorizationError.name, HttpStatusCode.FORBIDDEN],
      [MissingRequiredFieldError.name, HttpStatusCode.BAD_REQUEST]
    ]);

    const status = errorMap.get(error.constructor.name) ?? HttpStatusCode.SERVER_ERROR;
    this.res.status(status).json({
      error: {
        message: error.message
      }
    });
  }

  async success(response: Response): Promise<void> {
    this.res.status(HttpStatusCode.RESOURCE_CREATED).json(response);
  }
}