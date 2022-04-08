import { User } from "@entities/user";
import { AuthenticationService } from "@use-cases/authenticate/dependencies/authentication-service.interface";
import { sign, SignOptions } from 'jsonwebtoken';

export class JWTAuthService implements AuthenticationService {
  generateTokenFor(user: User): Promise<string> {
    const secret = process.env.JWT_SECRET!;
    const { JWT_TIME_TO_LIVE_IN_HOURS = '24' } = process.env;
    const options: SignOptions = { expiresIn: `${JWT_TIME_TO_LIVE_IN_HOURS}h` };
    const payload = { ownerId: user.id };
    
    return new Promise((resolve, reject) => {
      sign(payload, secret, options, (error, token) => {
        if(!!error) {
          return reject(error);
        }

        return resolve(token!);
      });
    });
  }
}