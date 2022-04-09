import { Message } from "@entities/message";
import { getMock } from "@test/test-utils/get-mock";
import { GetAllRepository } from "@use-cases/interfaces/repository";
import { UseCaseOutputPort } from "@use-cases/interfaces/use-case-output-port";
import { RetrieveMessagesUseCase } from "@use-cases/retrieve-messages";
import { MessageDTO } from "@use-cases/retrieve-messages/dtos/response";
import faker from "faker";

describe('Retrieve messages use case tests', () => {
  const messagesRepo = getMock<GetAllRepository<Message>>(['getAll']);
  const presenter = getMock<UseCaseOutputPort<any>>(['success']);
  const sut = new RetrieveMessagesUseCase({ messagesRepo, presenter });

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockReturnValue(Date.now());
  })

  it('should retrieve the messages from the repository', async () => {
    const messages = new Array(5).fill(1).map(() => new Message({
      id: faker.datatype.uuid(),
      postedAt: new Date(Date.now()),
      text: faker.random.words(),
      userId: faker.datatype.uuid(),
      username: faker.name.findName()
    }));

    jest.spyOn(messagesRepo, 'getAll').mockResolvedValueOnce(messages);
    
    const messagesDTOs: MessageDTO[] = messages.map(message => ({
      postedAt: message.postedAt,
      text: message.text,
      username: message.username
    }))
    await sut.execute();
    expect(presenter.success).toBeCalledWith({ messages: messagesDTOs });
  });
})