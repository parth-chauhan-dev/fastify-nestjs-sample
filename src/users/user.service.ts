import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';
import { UserListOutput } from './dtos';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(user: Partial<UserEntity>) {
    return this.userRepository.create(user);
  }

  async get(user): Promise<UserListOutput[]> {
    console.log('user ==> ', user);
    const users = await this.userRepository.findAll();
    return users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}
