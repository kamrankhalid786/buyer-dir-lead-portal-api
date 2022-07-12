import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { UserService } from '../user.service';

@Injectable()
export class UserSeed {
  constructor(private readonly userService: UserService) {}

  @Command({
    command: 'seed:user',
    describe: 'Create default user',
  })
  async create() {
    const user = await this.userService.create({
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'kamrankhalid06@yahoo.com',
      password: '123456',
      userRole: '62c0d52a777bd22068dd774f',
      phone: '1112223333',
      confirmPassword: '123456',
    });
    console.log(`User created: ${user.firstName} ${user.lastName}`);
  }
}
