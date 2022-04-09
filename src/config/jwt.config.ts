import { registerAs } from '@nestjs/config';
import { env } from 'process';

require('dotenv').config();

export default registerAs('jwt', () => {
  return {
    secret: env.JWT_SECRET,
    signOptions: {
      expiresIn: env.JWT_EXPIRY,
    },
  };
});
