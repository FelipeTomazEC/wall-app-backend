import { HttpStatusCode } from '@interface-adapters/shared/http-status-code';
import { UseCaseOutputPort } from '@use-cases/interfaces/use-case-output-port';
import { RegisterUserResponse as Response } from '@use-cases/register-user/dtos/response';
import { EmailAlreadyRegisteredError } from '@use-cases/register-user/errors/email-already-registered-error';
import { InvalidEmailError } from '@use-cases/register-user/errors/invalid-email-error';
import { Response as ExpressResponse } from 'express';

export class RegisterUserPresenter implements UseCaseOutputPort<Response> {
  constructor(private readonly response: ExpressResponse) {}

  async failure(error: Error): Promise<void> {
    const errorMap = new Map<string, HttpStatusCode>([
      [EmailAlreadyRegisteredError.name, HttpStatusCode.CONFLICT],
      [InvalidEmailError.name, HttpStatusCode.BAD_REQUEST],
    ]);

    const statusCode =
      errorMap.get(error.constructor.name) ?? HttpStatusCode.SERVER_ERROR;
    this.response.status(statusCode).json({
      error: {
        message: error.message,
      },
    });
  }

  async success(response: Response): Promise<void> {
    this.response.status(HttpStatusCode.RESOURCE_CREATED).json(response);
  }
}
