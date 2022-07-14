import {
  Body,
  Controller,
  Get,
  Head,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('/onlyauth')
  @UseGuards(AuthGuard('jwt'))
  async hiddenInformation(@Req() req) {
    return req.user;
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    const user = await this.userService.findByLogin(loginDTO);
    const payload = {
      email: user.email,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token, token_type: 'Bearer' };
  }

  // Get user by token
  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async me(@Req() req) {
    return {
      data: {
        attributes: {
          email: req.user.email,
          name: req.user.firstName,
        },
        id: req.user._id,
        type: 'users',
      },
    };
  }
}
