import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: 'SECRET', // TODO: Use secret from env
    signOptions: {
      expiresIn: '5m', // TODO: Set expiry from env
    },
  };
});
