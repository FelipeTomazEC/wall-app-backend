import { BcryptPasswordEncrypter } from '@infra/implementations/bcrypt-password-encrypter';
import faker from 'faker';

describe('Bcrypt password encrypter tests', () => {
  const sut = new BcryptPasswordEncrypter();

  it('should encode the given password.', async () => {
    const password = faker.internet.password();
    const encoded = await sut.encrypt(password);

    expect(encoded).not.toBe(password);
  });

  it('should generate different hashes for equal passwords.', async () => {
    const password = faker.internet.password();
    const encoded1 = await sut.encrypt(password);
    const encoded2 = await sut.encrypt(password);

    expect(encoded1).not.toBe(encoded2);
  });

  it('should be able to verify if a password is the seed of the hash.', async () => {
    const password = faker.internet.password();
    const encoded = await sut.encrypt(password);
    const anotherPassword = faker.internet.password();

    expect(sut.verify(password, encoded)).resolves.toBeTruthy();
    expect(sut.verify(anotherPassword, encoded)).resolves.toBeFalsy();
  });
});