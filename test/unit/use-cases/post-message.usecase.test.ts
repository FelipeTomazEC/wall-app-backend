import { Message } from "@entities/message";
import { User } from "@entities/user";
import { getMock } from "@test/test-utils/get-mock";
import { IdGenerator } from "@use-cases/interfaces/id-generator.interface";
import { GetByIdRepository, SaveRepository } from "@use-cases/interfaces/repository";
import { UseCaseOutputPort } from "@use-cases/interfaces/use-case-output-port";
import { PostMessageUseCase } from "@use-cases/post-message";
import { AuthorizationService } from "@use-cases/post-message/dependencies/authorization-service.interface";
import { AuthorizationError } from "@use-cases/post-message/errors/authorization-error";
import { failure, success } from "@utils/either";
import faker from "faker";

describe('Post message use cases tests', () => {
  const authService = getMock<AuthorizationService>(['authorize']);
  const idGenerator = getMock<IdGenerator>(['generate']);
  const messagesRepo = getMock<SaveRepository<Message>>(['save']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure', 'success']);
  const usersRepo = getMock<GetByIdRepository<User>>(['getById']);
  let user: User;
  const sut = new PostMessageUseCase({
    authService,
    idGenerator,
    messagesRepo,
    presenter,
    usersRepo
  });
  
  beforeAll(() => {
    user = new User({
      email: faker.internet.email(),
      id: faker.datatype.uuid(),
      name: faker.name.findName(),
      password: faker.internet.password()
    });
    jest.spyOn(authService, 'authorize').mockResolvedValue(success(user.id));
    jest.spyOn(usersRepo, 'getById').mockResolvedValue(user);
    jest.spyOn(Date, 'now').mockReturnValue(Date.now());
  })

  it('should verify if the token is valid.', async () => {
    const error = new AuthorizationError();
    jest.spyOn(authService, 'authorize').mockResolvedValueOnce(failure(error));
    await sut.execute({
      text: faker.random.words(),
      token: faker.git.commitSha()
    });
    
    expect(presenter.failure).toBeCalledWith(error);
  });

  it('should save the message in the repository and return the id.', async () => {
    const id = faker.datatype.uuid();
    jest.spyOn(idGenerator, 'generate').mockResolvedValueOnce(id);
    const text = faker.random.words();
    const token = faker.git.commitSha();
    await sut.execute({ text, token });

    expect(messagesRepo.save).toBeCalledWith(new Message({
      id,
      postedAt: new Date(Date.now()),
      text,
      userId: user.id,
      username: user.name
    }));
    expect(presenter.success).toBeCalledWith({ id });
  });
})