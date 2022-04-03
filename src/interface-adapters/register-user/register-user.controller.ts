import { MissingRequiredFieldError } from "@interface-adapters/shared/errors/missing-required-field-error";
import { HttpController } from "@interface-adapters/shared/http-controller";
import { HttpRequest } from "@interface-adapters/shared/http-request";
import { RegisterUserRequest } from "@use-cases/register-user/dtos/request";
import { Either } from "@utils/either";

export class RegisterUserController extends HttpController<RegisterUserRequest> {
  protected extractParameters(httpRequest: HttpRequest): RegisterUserRequest {
    const { name, email } = httpRequest.body;
    return { name, email }; 
  }

  protected checkForMissingParams(request: RegisterUserRequest): Either<MissingRequiredFieldError, null> {
    
  }
}