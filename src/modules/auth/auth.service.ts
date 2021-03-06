import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { RoleType } from '../role/role.type.enum';
import { ReadUserDto } from '../user/dto';
import { User } from '../user/entities/user.entity';
import { AuthRepository } from './auth.repository';
import { LogguedInDto, SinginDto, SingupDto } from './dto';
import { SignupDto } from './dto/signup.dto';
import { IJwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
    private readonly _jwtService: JwtService,
  ) {}

  async singup(singupDto: SingupDto): Promise<SignupDto> {
    const { username, email } = singupDto;
    const userExists = await this._authRepository.findOne({
      where: [{ username }, { email }],
    });

    if (userExists) {
      throw new ConflictException('username or email already exist');
    }

    await this._authRepository.signup(singupDto);

    const message = 'Signup Succefull'
    const status = 'SUCCESS';
    const user = await this._authRepository.findOne({
      where: [{username} , {email}]
    })  

    return plainToClass(SignupDto, {message, user, status});
  }

  // Login
  async singin(singinDto: SinginDto): Promise<LogguedInDto> {
    const { username, password } = singinDto;
    const user: User = await this._authRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('user does not exist');
      
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('invalid credentials');
    }

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map((r) => r.name as RoleType),
    };

    const token = this._jwtService.sign(payload);

    const message = 'Login Successful';

    const status = 'SUCCESS';

    return plainToClass(LogguedInDto, { token, user, message, status });
  }
}
