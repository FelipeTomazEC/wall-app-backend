import { RegisterUserUseCase } from "@use-cases/register-user";
import { getMock } from "@test/test-utils/get-mock";
import { UseCaseOutputPort } from "@use-cases/interfaces/use-case-output-port";
import { SaveRepository } from "@use-cases/interfaces/repository";
import { User } from "@entities/user";
import { EmailSender } from "@use-cases/register-user/dependencies/email-sender.interface";
import { IdGenerator } from "@use-cases/register-user/dependencies/id-generator.interface";
import faker from 'faker';
import { EmailValidator } from "@use-cases/register-user/dependencies/email-validator.interface";
import { EmailExistsRepository } from "@use-cases/register-user/dependencies/email-exists-repository.interface";
import { InvalidEmailError } from "@use-cases/register-user/errors/invalid-email-error";
import { EmailAlreadyRegisteredError } from "@use-cases/register-user/errors/email-already-registered-error";

describe('Register user use case unit tests', () => {
  const presenter = getMock<UseCaseOutputPort<any>>(['failure', 'success']);
  const repository = getMock<SaveRepository<User> & EmailExistsRepository>(['save', 'emailExists']);
  const emailSender = getMock<EmailSender>(['sendEmail']);
  const emailValidator = getMock<EmailValidator>(['isValid']);
  const idGenerator = getMock<IdGenerator>(['generate']);
  const id = faker.datatype.uuid();
  const sut = new RegisterUserUseCase({ 
    presenter, 
    repository, 
    emailSender, 
    idGenerator, 
    emailValidator 
  });

  beforeAll(() => {
    jest.spyOn(idGenerator, 'generate').mockResolvedValue(id);
    jest.spyOn(emailValidator, 'isValid').mockReturnValue(true);
    jest.spyOn(repository, 'emailExists').mockResolvedValue(false);
  });

  it('should verify if the email is valid.', async () => {
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false);
    const email = 'not..email.com';
    const name = faker.name.findName();
    await sut.execute({ email, name });
    expect(presenter.failure).toBeCalledWith(new InvalidEmailError(email));
  });

  it('should verify if the email is already registered.', async () => {
    jest.spyOn(repository, 'emailExists').mockResolvedValueOnce(true);
    const email = faker.internet.email();
    const name = faker.name.findName();
    await sut.execute({ email, name });
    expect(presenter.failure).toBeCalledWith(new EmailAlreadyRegisteredError(email));
  });

  it('should save the user in the repository and send a welcome e-mail.', async () => {
    const email = faker.internet.email();
    const name = faker.name.findName();
    await sut.execute({ email, name });
    expect(emailSender.sendEmail).toBeCalledTimes(1);
    expect(idGenerator.generate).toBeCalledTimes(1);
  });

  it(`should send the new user's id to the presenter.`, async () => {
    const name = 'Felipe';
    const email = 'felipe@email.com';
    await sut.execute({ email, name });
    expect(presenter.success).toBeCalledWith({ id });
  });
})