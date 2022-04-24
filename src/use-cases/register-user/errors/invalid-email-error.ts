export class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`${email} is not a valid e-mail address.`);
  }
}
