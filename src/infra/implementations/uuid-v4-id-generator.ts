import { IdGenerator } from '@use-cases/interfaces/id-generator.interface';
import { v4 as uuidV4 } from 'uuid';

export class UUIDv4IdGenerator implements IdGenerator {
  async generate(): Promise<string> {
    return uuidV4();
  }
}
