import { MissingRequiredFieldError } from "@interface-adapters/shared/errors/missing-required-field-error";
import { HttpController } from "@interface-adapters/shared/http-controller";
import { Either, success } from "@utils/either";

export class RetrieveMessagesController extends HttpController<void> {
  protected extractParameters(): void {
    return undefined;
  }
  protected checkForMissingParams(): Either<MissingRequiredFieldError, void> {
    return success(undefined);
  }
}