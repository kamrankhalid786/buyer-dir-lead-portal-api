import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { RolesModule } from 'src/roles/roles.module';
import { RoleSeed } from 'src/roles/seeds/roles.seed';
import { UserSeed } from 'src/user/seeds/user.seed';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [CommandModule, UserModule, RolesModule],
  providers: [UserSeed, RoleSeed],
  exports: [UserSeed, RoleSeed],
})
export class SeedModule {}
