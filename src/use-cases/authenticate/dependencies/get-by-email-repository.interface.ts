import { User } from '@entities/user';

export interface GetByEmailRepository {
  getByEmail(email: string): Promise<User | null>;
}
