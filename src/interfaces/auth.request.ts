import { Session } from '@/entities/session.entity';
import { Request } from 'express';

export interface AuthRequest extends Request {
  session: Session;
}
