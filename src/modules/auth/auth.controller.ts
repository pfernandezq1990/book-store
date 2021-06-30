import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SinginDto, SingupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  //  Metodo para registrar un usuario
  @Post('/singup')
  @UsePipes(ValidationPipe)
  async singup(@Body() singupDto: SingupDto): Promise<void> {
    return this._authService.singup(singupDto);
  }

  //  Metodo para loguear a un usuario
  @Post('/singin')
  @UsePipes(ValidationPipe)
  async singin(@Body() singinDto: SinginDto) {
    return this._authService.singin(singinDto);
  }
}
