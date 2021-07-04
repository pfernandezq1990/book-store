import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { RoleRepository } from '../role/role.repository';
import { UserDto } from './dto/user.dto';
import { User, UserDetails } from './entities';
import { UserRepository } from './user.repository';
import { Status } from '../../share/entity-status.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  // Obtener un usuario
  async get(id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }

    const user: User = await this._userRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  // Obtener todos los usuarios
  async getAll(): Promise<User[]> {
    const users: User[] = await this._userRepository.find({
      where: { status: Status.ACTIVE },
    });

    return users;
  }

  // Crear un usuario
  async create(user: User): Promise<User> {
    const details = new UserDetails();
    user.details = details;

    const repo = await getConnection().getRepository(Role);
    const defaultRole = await repo.findOne({ where: { name: 'GENERAL' } });
    user.roles = [defaultRole];

    const savedUser: User = await this._userRepository.save(user);
    return savedUser;
  }

  // Update un usuario
  async update(id: number, user: User): Promise<void> {
    await this._userRepository.update(id, user);
  }

  async delete(id: number): Promise<void> {
    const userExist = await this._userRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });

    if (!userExist) {
      throw new NotFoundException();
    }

    await this._userRepository.update(id, { status: 'INACTIVE' });
  }

  //  Asignar un role a un usuario
  async setRoleToUser(userId: number, roleId: number) {
    const userExist = await this._userRepository.findOne(userId, {
      where: { status: Status.ACTIVE },
    });

    if (!userExist) {
      throw new NotFoundException('User does not exist');
    }

    const roleExist = await this._roleRepository.findOne(roleId, {
      where: { status: Status.ACTIVE },
    });

    if (!roleExist) {
      throw new NotFoundException('Role does not exist');
    }

    userExist.roles.push(roleExist);
    await this._userRepository.save(userExist);

    return true;
  }
}
