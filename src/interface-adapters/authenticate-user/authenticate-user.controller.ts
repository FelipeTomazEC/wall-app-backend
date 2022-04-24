import { MissingRequiredFieldError } from '@interface-adapters/shared/errors/missing-required-field-error';
import { HttpController } from '@interface-adapters/shared/http-controller';
import { HttpRequest } from '@interface-adapters/shared/http-request';
import { AuthenticateRequest as Request } from '@use-cases/authenticate/dtos/request';
import { Either, failure, success } from '@utils/either';
import { isEmptyString } from '@utils/is-empty-string';

export class AuthenticateUserController extends HttpController<Request> {
  protected extractParameters(httpRequest: HttpRequest): Request {
    const { email, password } = httpRequest.body;
    return { email, password };
  }

  protected checkForMissingParams(
    request: Request,
  ): Either<MissingRequiredFieldError, void> {
    const { email, password } = request;
    if (isEmptyString(email)) {
      return failure(new MissingRequiredFieldError('email'));
    }

    if (isEmptyString(password)) {
      return failure(new MissingRequiredFieldError('password'));
    }

    return success(undefined);
  }
}
