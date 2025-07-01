import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(user: Partial<UserEntity>){
    return this.userRepository.create(user);
  }
  
  async get() {
    return this.userRepository.findAll();
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}
