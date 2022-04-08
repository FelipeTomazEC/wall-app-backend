import { User } from "@entities/user";
import { GetByEmailRepository } from "@use-cases/authenticate/dependencies/get-by-email-repository.interface";
import { SaveRepository, } from '@use-cases/interfaces/repository';
import { EmailExistsRepository } from "@use-cases/register-user/dependencies/email-exists-repository.interface";

export class UserInMemoryRepository implements SaveRepository<User>, EmailExistsRepository, GetByEmailRepository {
  private static instance: UserInMemoryRepository | null = null;

  private readonly users: User[];

  private constructor() {
    this.users = [];
  }

  static getInstance(): UserInMemoryRepository {
    if(this.instance === null){
      this.instance = new UserInMemoryRepository();
    }

    return this.instance;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  emailExists(email: string): Promise<boolean> {
    const exists = this.users.some(user => user.email.toUpperCase() === email.toUpperCase());
    return Promise.resolve(exists);
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }
}