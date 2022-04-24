import { User } from "@entities/user";

export type Credentials = {
  token: string;
  expiredInSeconds: number;
};

export interface AuthenticationService {
  generateTokenFor(user: User): Promise<Credentials>;
}