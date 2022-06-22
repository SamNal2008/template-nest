import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger(UserRepository.name);

  constructor() {
    super();
  }

  async findOneByEmail(email: string): Promise<User> {
    this.logger.debug(`Finding user with email : ${email}`);
    return this.findOne({ email });
  }

  async isEmailAlreadyUsed(email: string): Promise<boolean> {
    this.logger.debug(`Check if email : ${email} is already used`);
    return (await this.count({ where: [{ email }] })) !== 0;
  }
}
