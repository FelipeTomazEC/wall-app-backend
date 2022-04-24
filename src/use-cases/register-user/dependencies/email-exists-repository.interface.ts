export interface EmailExistsRepository {
  emailExists(email: string): Promise<boolean>;
}
