import { User } from "@entities/user";
import { UserInMemoryRepository } from "@infra/database/user-in-memory-repository";
import faker from 'faker';

describe('User in memory repository tests', () => {
  const sut = UserInMemoryRepository.getInstance();

  it('should be singleton', () => {
    const anotherInstance = UserInMemoryRepository.getInstance();
    expect(sut === anotherInstance).toBeTruthy();
  });

  it('should save the user', async () => {
    const user = new User({
      email: faker.internet.email(),
      id: faker.datatype.uuid(),
      name: faker.name.findName(),
      password: faker.internet.password()
    });

    const existsBeforeSaving = await sut.emailExists(user.email);
    await sut.save(user);
    const existsAfterSaving = await sut.emailExists(user.email);
    
    expect(existsBeforeSaving).toBeFalsy();
    expect(existsAfterSaving).toBeTruthy();
  });
})