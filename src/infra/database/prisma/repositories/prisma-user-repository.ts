import { User } from '@entities/user';
import { PrismaClient } from '@prisma/client';
import { GetByEmailRepository } from '@use-cases/authenticate/dependencies/get-by-email-repository.interface';
import {
  GetByIdRepository,
  SaveRepository,
} from '@use-cases/interfaces/repository';
import { EmailExistsRepository } from '@use-cases/register-user/dependencies/email-exists-repository.interface';

export class PrismaUserRepository
  implements
    SaveRepository<User>,
    EmailExistsRepository,
    GetByEmailRepository,
    GetByIdRepository<User>
{
  constructor(private readonly client: PrismaClient) {}

  async getById(id: string): Promise<User | null> {
    const userData = await this.client.user.findUnique({
      where: {
        id,
      },
    });

    this.client.$disconnect();

    if (!userData) {
      return null;
    }

    const { email, name, password } = userData;

    return new User({ id, email, name, password });
  }

  async getByEmail(email: string): Promise<User | null> {
    const userData = await this.client.user.findUnique({
      where: {
        email,
      },
    });

    this.client.$disconnect();

    if (!userData) {
      return null;
    }

    const { id, name, password } = userData;

    return new User({ email, id, name, password });
  }

  async emailExists(email: string): Promise<boolean> {
    const exists = await this.client.user.findFirst({
      where: {
        email,
      },
    });

    this.client.$disconnect();

    return !!exists;
  }

  async save(entity: User): Promise<void> {
    await this.client.user.create({
      data: {
        email: entity.email,
        id: entity.id,
        name: entity.name,
        password: entity.password,
      },
    });

    this.client.$disconnect();
  }
}
