import { MissingRequiredFieldError } from "@interface-adapters/shared/errors/missing-required-field-error";
import { HttpController } from "@interface-adapters/shared/http-controller";
import { HttpRequest } from "@interface-adapters/shared/http-request";
import { PostMessageRequest } from "@use-cases/post-message/dtos/request";
import { Either, failure, success } from "@utils/either";
import { isEmptyString } from "@utils/is-empty-string";

export class PostMessageController extends HttpController<PostMessageRequest> {
  protected extractParameters(httpRequest: HttpRequest): PostMessageRequest {
    const authHeader = httpRequest.getHeader<string>('authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    const text = httpRequest.body.message;
    return { token, text };
  }

  protected checkForMissingParams(request: PostMessageRequest): Either<MissingRequiredFieldError, void> {
    if(isEmptyString(request.text)) {
      return failure(new MissingRequiredFieldError('message'));
    }

    return success(undefined);
  }
}