import { EmailValidator } from "@use-cases/register-user/dependencies/email-validator.interface";
import { validate } from 'email-validator';

export class EmailValidatorImpl implements EmailValidator {
  isValid(email: string): boolean {
    return validate(email);
  }
}