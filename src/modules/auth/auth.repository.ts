import { genSalt, hash } from 'bcryptjs';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { Role } from '../role/entities';
import { RoleRepository } from '../role/role.repository';
import { RoleType } from '../role/role.type.enum';
import { User, UserDetails } from '../user/entities';
import { SingupDto } from './dto';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async signup(singupDto: SingupDto) {
    const { username, email, password, name, lastname, dateOfBirth } = singupDto;
    const user = new User();
    user.username = username;
    user.email = email;

    const roleRepository: RoleRepository = await getConnection().getRepository(
      Role,
    );

    const defaultRole: Role = await roleRepository.findOne({
      where: { name: RoleType.GENERAL },
    });
    user.roles = [defaultRole];
    
    const details = new UserDetails();
    details.name = name;
    details.lastname = lastname;
    details.dateOfBirth = dateOfBirth;
    user.details = details;

    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    await user.save();
  }
}
