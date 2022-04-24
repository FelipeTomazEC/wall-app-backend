export type Either<F, S> = Failure<F, S> | Success<F, S>;

export class Failure<F, S> {
  constructor(readonly value: F) {}

  isFailure(): this is Failure<F, S> {
    return true;
  }

  isSuccess(): this is Success<F, S> {
    return false;
  }
}

export class Success<F, S> {
  constructor(readonly value: S) {}

  isFailure(): this is Failure<F, S> {
    return false;
  }

  isSuccess(): this is Success<F, S> {
    return true;
  }
}

export const failure = <F, S>(value: F): Failure<F, S> =>
  new Failure<F, S>(value);

export const success = <F, S>(value: S): Success<F, S> =>
  new Success<F, S>(value);
