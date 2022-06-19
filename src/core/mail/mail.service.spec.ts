import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../api/users/entities/user.entity';
import { TokenService } from '../security/token/token.service';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;

  const mockSendMailFun = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: mockSendMailFun,
          },
        },
        {
          provide: TokenService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call sendMail function', () => {
    service.sendEmailWithTokenToUser({} as User, '');
    expect(mockSendMailFun).toHaveBeenCalled();
  });
});
