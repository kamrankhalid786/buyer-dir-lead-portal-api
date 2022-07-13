import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const userEmail = email.toLowerCase();
    const user = await this.userService.findByEmail(userEmail);
    const passwordValidate = await bcrypt.compare(password, user.password);

    if (!user) {
      throw new NotAcceptableException('Could not find user');
    }

    if (user && passwordValidate) {
      return user;
    }

    throw new NotAcceptableException('Invalid credentials');
  }

  async validateUserToken(email) {
    return await this.userService.findByPayload(email);
  }

  async signPayload(payload) {
    return sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' });
  }

  async verifyToken(token) {
    return await sign(token, process.env.SECRET_KEY);
  }
}
