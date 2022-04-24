import { Message } from "@entities/message";
import { MessagesInMemoryRepository } from "@infra/database/in-memory/messages-in-memory-repository";
import faker from "faker";

describe('Messages in memory tests', () => {
  const sut = MessagesInMemoryRepository.getInstance();

  it('should be singleton', () => {
    const anotherInstance = MessagesInMemoryRepository.getInstance();
    expect(sut === anotherInstance).toBeTruthy();
  });

  it('should save the message', async () => {
    const message = new Message({
      id: faker.datatype.uuid(),
      postedAt: new Date(Date.now()),
      text: faker.random.words(),
      userId: faker.datatype.uuid(),
      username: faker.name.findName()
    })

    await expect(sut.save(message)).resolves.not.toBeDefined();
  });

  it('should retrieve all messages', async () => {
    const messages = new Array(5).fill(1).map(() => new Message({
      id: faker.datatype.uuid(),
      postedAt: new Date(Date.now()),
      text: faker.random.words(),
      userId: faker.datatype.uuid(),
      username: faker.name.findName()
    }));

    await Promise.all(messages.map((m) => sut.save(m)));

    const retrieved = await sut.getAll();
    const isAllMessagesInRetrievedResponse = messages.every(m => retrieved.some(item => item.id === m.id));
    expect(isAllMessagesInRetrievedResponse).toBeTruthy();
  });
});