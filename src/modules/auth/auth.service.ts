import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { RoleType } from '../role/role.type.enum';
import { User } from '../user/entities/user.entity';
import { AuthRepository } from './auth.repository';
import { SinginDto, SingupDto } from './dto';
import { IJwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
    private readonly _jwtService: JwtService,
  ) {}

  async singup(singupDto: SingupDto): Promise<void> {
    const { username, email } = singupDto;
    const userExists = await this._authRepository.findOne({
      where: [{ username }, { email }],
    });

    if (userExists) {
      throw new ConflictException('username or email already exist');
    }

    return this._authRepository.signup(singupDto);
  }

  async singin(singinDto: SinginDto): Promise<{ token: string }> {
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

    const token = await this._jwtService.sign(payload);
    return { token };
  }
}
