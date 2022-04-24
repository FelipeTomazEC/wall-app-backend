import { User } from '@entities/user';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';
import { AuthorizationError } from '@use-cases/post-message/errors/authorization-error';
import faker from 'faker';

describe('JWT auth service implementation tests', () => {
  const sut = new JWTAuthService();

  const user = new User({
    email: faker.internet.email(),
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    password: faker.internet.password(),
  });

  beforeAll(() => {
    process.env.JWT_TIME_TO_LIVE_IN_HOURS = '5';
    process.env.JWT_SECRET = faker.git.commitSha();
  });

  test('It should get an user and generate a json web token.', async () => {
    const credentials = await sut.generateTokenFor(user);
    const expectedExpirationTime = 5 * 3600;
    expect(credentials.token).toBeTruthy();
    expect(credentials.expiredInSeconds).toBe(expectedExpirationTime);
  });

  test('It should return an error to invalid tokens.', async () => {
    const ownerIdOrError = await sut.authorize('invalid-token');

    expect(ownerIdOrError.isFailure()).toBe(true);
    expect(ownerIdOrError.value).toStrictEqual(new AuthorizationError());
  });

  test('It should return the id of the owner to valid tokens.', async () => {
    const credentials = await sut.generateTokenFor(user);
    const ownerIdOrError = await sut.authorize(credentials.token);

    expect(ownerIdOrError.isSuccess()).toBe(true);
    expect(ownerIdOrError.value).toStrictEqual(user.id);
  });

  test('It should return an error to expired tokens.', async () => {
    process.env.JWT_TIME_TO_LIVE_IN_HOURS = '0';
    const credentials = await sut.generateTokenFor(user);
    const ownerIdOrError = await sut.authorize(credentials.token);

    expect(ownerIdOrError.isFailure()).toBe(true);
    expect(ownerIdOrError.value).toStrictEqual(new AuthorizationError());
  });
});
