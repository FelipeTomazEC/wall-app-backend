import { User } from '@entities/user';
import {
  AuthenticationService,
  Credentials,
} from '@use-cases/authenticate/dependencies/authentication-service.interface';
import { AuthorizationService } from '@use-cases/post-message/dependencies/authorization-service.interface';
import { AuthorizationError } from '@use-cases/post-message/errors/authorization-error';
import { Either, failure, success } from '@utils/either';
import { sign, SignOptions, verify } from 'jsonwebtoken';

type TokenPayload = {
  ownerId: string;
};

export class JWTAuthService
  implements AuthenticationService, AuthorizationService
{
  generateTokenFor(user: User): Promise<Credentials> {
    const secret = process.env.JWT_SECRET!;
    const { JWT_TIME_TO_LIVE_IN_HOURS = '24' } = process.env;
    const options: SignOptions = { expiresIn: `${JWT_TIME_TO_LIVE_IN_HOURS}h` };
    const payload = { ownerId: user.id };

    return new Promise<Credentials>((resolve, reject) => {
      sign(payload, secret, options, (error, token) => {
        if (error || !token) {
          return reject(error);
        }

        const expiredInSeconds = parseInt(JWT_TIME_TO_LIVE_IN_HOURS) * 3600;

        return resolve({ expiredInSeconds, token });
      });
    });
  }

  async authorize(token: string): Promise<Either<AuthorizationError, string>> {
    const secret = process.env.JWT_SECRET!;

    return new Promise((resolve) => {
      verify(token, secret, (error, payload) => {
        if (error) {
          return resolve(failure(new AuthorizationError()));
        }

        const { ownerId } = payload as TokenPayload;

        return resolve(success(ownerId));
      });
    });
  }
}
