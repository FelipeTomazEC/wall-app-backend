export interface UseCaseOutputPort<T> {
  failure(error: Error): Promise<void>;
  success(response: T): Promise<void>;
}