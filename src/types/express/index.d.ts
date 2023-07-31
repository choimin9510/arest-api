import { Session } from '@/entities/session.entity';

declare global {
  namespace Express {
    interface Request {
      /** 세션정보 */
      session: Session;
    }
  }
}
