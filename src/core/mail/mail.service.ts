import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../../api/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailWithTokenToUser(user: User, token: string): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'othob@sipios.com',
      subject: 'Fidelity 🎁 ! Votre code de confirmation !',
      template: 'confirmation',
      context: {
        name: user.userName,
        securityCode: token,
      },
    });
  }
}
