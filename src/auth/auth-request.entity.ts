import { Request } from 'express';
import { User } from 'src/users/user.entity';

export type AuthRequest = Request & { user: User };
