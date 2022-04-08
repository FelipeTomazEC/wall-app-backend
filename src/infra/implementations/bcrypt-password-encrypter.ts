import { PasswordEncrypter } from "@use-cases/interfaces/password-encrypter.interface";
import { compare, genSalt, hash } from 'bcrypt';

export class BcryptPasswordEncrypter implements PasswordEncrypter {
  async encrypt(password: string): Promise<string> {
    const SALT_ROUNDS = 11;
    const salt = await genSalt(SALT_ROUNDS);
    return hash(password, salt);
  }

  verify(password: string, encryptedPassword: string): Promise<boolean> {
    return compare(password, encryptedPassword);
  }
}