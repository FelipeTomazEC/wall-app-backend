import { User } from "@entities/user";

export type Token = string;

export interface AuthenticationService {
  generateTokenFor(user: User): Promise<Token>;
}