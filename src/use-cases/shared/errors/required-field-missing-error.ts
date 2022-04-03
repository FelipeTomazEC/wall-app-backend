export class MissingRequiredFieldError extends Error {
  constructor(fieldName: string) {
    super(`Field ${fieldName} cannot be null or empty.`)
  }
}