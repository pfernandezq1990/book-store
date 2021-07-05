import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ShareModule } from '../../share/share.module';
import { UserRepository } from './user.repository';
import { AuthModule } from '../auth/auth.module';
import { RoleRepository } from '../role/role.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, RoleRepository]),
    ShareModule,
    AuthModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
