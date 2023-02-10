import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger(UserRepository.name);

  async findOneByEmail(email: string): Promise<User> {
    this.logger.debug(`Finding user with email : ${email}`);
    return this.findOne({ where: { email } });
  }

  async isEmailAlreadyUsed(email: string): Promise<boolean> {
    this.logger.debug(`Check if email : ${email} is already used`);
    return (await this.count({ where: [{ email }] })) !== 0;
  }
}
