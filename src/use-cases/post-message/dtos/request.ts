import { Token } from '@use-cases/authenticate/dependencies/authentication-service.interface';

export type PostMessageRequest = {
  token: Token;
  text: string;
}