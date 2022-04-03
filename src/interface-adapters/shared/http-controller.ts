import { ErrorLogger } from "@interface-adapters/interfaces/logger"
import { UseCaseInputPort } from "@use-cases/interfaces/use-case-input-port";
import { UseCaseOutputPort } from "@use-cases/interfaces/use-case-output-port";
import { MissingRequiredFieldError } from "@interface-adapters/shared/errors/missing-required-field-error";
import { Either } from "@utils/either";
import { HttpRequest } from "./http-request";
import { InternalServerError } from "./errors/internal-server-error";

type Dependencies<T> = {
  logger: ErrorLogger;
  useCase: UseCaseInputPort<T>;
  presenter: UseCaseOutputPort<any>;
}

export abstract class HttpController<T> {
  constructor(private readonly dependencies: Dependencies<T>) {}

  async handle(httpRequest: HttpRequest): Promise<void> {
    const { logger, useCase, presenter } = this.dependencies;
    try {
      const useCaseRequest = this.extractParameters(httpRequest);
      const isSomeParamMissing = this.checkForMissingParams(useCaseRequest);
      if(isSomeParamMissing.isFailure()) {
        return presenter.failure(isSomeParamMissing.value);
      }

      await useCase.execute(useCaseRequest);
    }catch(err) {
      const error = err as Error;
      await logger.log(error);
      return presenter.failure(new InternalServerError());
    }
  }

  protected abstract extractParameters(httpRequest: HttpRequest): T;

  protected abstract checkForMissingParams(request: T): Either<MissingRequiredFieldError, void>;
}