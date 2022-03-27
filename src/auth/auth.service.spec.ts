import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: 'SECRET', // TODO: Use secret from env
          signOptions: {
            expiresIn: '5m', // TODO: Set expiry from env
          },
        }),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return undefined', async () => {
      const user = await service.validateUser('wrong@mail.com', 'wrongpass');
      expect(user).toBeUndefined();
    });

    it('should return undefined when validaing a wrong password', async () => {
      const user = await service.validateUser('test@mail.com', 'wrongpass');
      expect(user).toBeUndefined();
    });

    it('should return an user', async () => {
      const user = await service.validateUser('test@mail.com', 'supersecret');
      expect(user).toBeDefined();
    });
  });

  describe('generateToken', () => {
    it('should return an access token', async () => {
      const user = await service.validateUser('test@mail.com', 'supersecret');
      expect(user).toBeDefined();

      const { accessToken } = await service.generateToken(user);
      expect(accessToken).toBeDefined();
    });
  });
});
