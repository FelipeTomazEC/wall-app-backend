import { MissingRequiredFieldError } from '@interface-adapters/shared/errors/missing-required-field-error';
import { HttpStatusCode } from '@interface-adapters/shared/http-status-code';
import { AuthenticateResponse as Response } from '@use-cases/authenticate/dtos/response';
import { AuthenticationError } from '@use-cases/authenticate/errors/wrong-email-or-password-error';
import { UseCaseOutputPort } from '@use-cases/interfaces/use-case-output-port';
import { Response as ExpressResponse } from 'express';

export class AuthenticateUserPresenter implements UseCaseOutputPort<Response> {
  constructor(private readonly res: ExpressResponse) {}

  async failure(error: Error): Promise<void> {
    const errorMap = new Map<string, HttpStatusCode>([
      [MissingRequiredFieldError.name, HttpStatusCode.BAD_REQUEST],
      [AuthenticationError.name, HttpStatusCode.UNAUTHORIZED],
    ]);

    const statusCode =
      errorMap.get(error.constructor.name) ?? HttpStatusCode.SERVER_ERROR;
    this.res.status(statusCode).json({
      error: {
        message: error.message,
      },
    });
  }

  async success(response: Response): Promise<void> {
    this.res.status(HttpStatusCode.OK).json(response);
  }
}
