import { Either } from "@utils/either";
import { AuthorizationError } from "../errors/authorization-error";

export type TokenOwnerID = string;

export interface AuthorizationService {
  authorize(token: string): Promise<Either<AuthorizationError, TokenOwnerID>>;
}