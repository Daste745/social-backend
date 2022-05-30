import { Request } from 'express';
import { User } from 'src/users/entities';

export type AuthRequest = Request & { user: User };
