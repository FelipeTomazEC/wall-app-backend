import { User } from "@entities/user";
import { getMock } from "@test/test-utils/get-mock";
import { AuthenticateUseCase } from "@use-cases/authenticate";
import { AuthenticationService } from "@use-cases/authenticate/dependencies/authentication-service.interface";
import { GetByEmailRepository } from "@use-cases/authenticate/dependencies/get-by-email-repository.interface";
import { AuthenticationError } from "@use-cases/authenticate/errors/wrong-email-or-password-error";
import { UseCaseOutputPort } from "@use-cases/interfaces/use-case-output-port";
import faker from 'faker';

describe('Authenticate use case tests.', () => {
  const authService = getMock<AuthenticationService>(['generateTokenFor']);
  const repository = getMock<GetByEmailRepository>(['getByEmail']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure', 'success']);
  const sut = new AuthenticateUseCase({ authService, repository, presenter });
  let user: User;
  
  beforeAll(() => {
    user = new User({
      name: faker.name.findName(),
      email: faker.internet.email(),
      id: faker.datatype.uuid(),
      password: faker.internet.password()
    });
    jest.spyOn(repository, 'getByEmail').mockResolvedValue(user);
  })

  it('should return authentication error if the e-mail is not found.', async () => {
    jest.spyOn(repository, 'getByEmail').mockResolvedValueOnce(null);
    await sut.execute({ 
      email: faker.internet.email(),
      password: faker.internet.password()
    });
    expect(presenter.failure).toBeCalledWith(new AuthenticationError());
  });

  it('should return authentication error if the password is wrong.', async () => {
    await sut.execute({
      email: user.email,
      password: faker.internet.password()
    });
    expect(presenter.failure).toBeCalledWith(new AuthenticationError());
  });

  it('should generate a token and send it to the presenter.', async () => {
    const token = faker.random.word();
    jest.spyOn(authService, 'generateTokenFor').mockResolvedValue(token);
    await sut.execute({ email: user.email, password: user.password })
    expect(presenter.success).toBeCalledWith({ token });
  });
})