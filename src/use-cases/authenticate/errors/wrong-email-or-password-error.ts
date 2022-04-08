export class AuthenticationError extends Error {
  constructor() {
    super('Wrong e-mail or password.');
  }
}