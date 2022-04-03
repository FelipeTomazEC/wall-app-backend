import { MissingRequiredFieldError } from "@interface-adapters/shared/errors/missing-required-field-error";
import { HttpController } from "@interface-adapters/shared/http-controller";
import { HttpRequest } from "@interface-adapters/shared/http-request";
import { RegisterUserRequest } from "@use-cases/register-user/dtos/request";
import { Either, failure, success } from "@utils/either";
import { isEmptyString } from "@utils/is-empty-string";

export class RegisterUserController extends HttpController<RegisterUserRequest> {
  protected extractParameters(httpRequest: HttpRequest): RegisterUserRequest {
    const { name, email } = httpRequest.body;
    return { name, email }; 
  }

  protected checkForMissingParams(request: RegisterUserRequest): Either<MissingRequiredFieldError, void> {
    const { name, email } = request;
    const isNameMissing = isEmptyString(name);
    if(isNameMissing) {
      return failure(new MissingRequiredFieldError('name'));
    }

    const isEmailMissing = isEmptyString(email);
    if(isEmailMissing) {
      return failure(new MissingRequiredFieldError('email'));
    }

    return success(undefined);
  }
}