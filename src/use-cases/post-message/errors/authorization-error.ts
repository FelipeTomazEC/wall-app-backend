export class AuthorizationError extends Error {
  constructor(){
    super('Invalid token.');
  }
}