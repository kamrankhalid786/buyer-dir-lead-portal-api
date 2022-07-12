import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { RolesService } from '../roles.service';

@Injectable()
export class RoleSeed {
  constructor(private readonly roleService: RolesService) {}

  @Command({
    command: 'seed:role',
    describe: 'Create default roles',
  })
  async create() {
    await this.roleService.create({
      name: 'Agent',
      description: 'Admin Role',
    });

    await this.roleService.create({
      name: 'Buyer',
      description: 'Loan Officer',
    });
  }
}
