export class EmailAlreadyRegisteredError extends Error {
  constructor(email: string) {
    super(`E-mail ${email} is already registered.`);
  }
}