import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { UserSeed } from 'src/user/seeds/user.seed';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [CommandModule, UserModule],
  providers: [UserSeed],
  exports: [UserSeed],
})
export class SeedModule {}
