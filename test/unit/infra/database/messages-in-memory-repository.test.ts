import { Message } from "@entities/message";
import { MessagesInMemoryRepository } from "@infra/database/messages-in-memory-repository";
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
});