export class InternalServerError extends Error {
  constructor() {
    super(`Occurred and unexpected error while processing the request. Try again later.`);
  }
}