export interface SaveRepository<T> {
  save(entity: T): Promise<void>;
}

export interface GetByIdRepository<T> {
  getById(id: string): Promise<T | null>;
}

export interface GetAllRepository<T> {
  getAll(): Promise<T[]>;
}
