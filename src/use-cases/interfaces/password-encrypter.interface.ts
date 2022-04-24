export interface PasswordEncrypter {
  encrypt(password: string): Promise<string>;
  verify(password: string, encryptedPassword: string): Promise<boolean>;
}
