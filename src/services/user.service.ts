import { Session } from '@/entities/session.entity';
import { BaseRepository } from '@/repositories/base.repository';
import { inject, injectable } from 'inversify';
import { v1 as uuid } from 'uuid';

@injectable()
export class UserService {
  @inject(BaseRepository) private readonly SessionRepository: BaseRepository<Session>;

  /**
   * 세션 정보 조회
   * @param sessionId 세션 아이디
   * @returns 세션 정보
   */
  findSession(sessionId: string) {
    return this.SessionRepository.find({ where: { uuid: sessionId } });
  }

  /**
   * 세션 정보 저장
   * @param cookies 쿠키정보
   */
  saveSession(cookies: string) {
    const session = new Session();

    session.uuid = uuid();
    session.data = cookies;

    return this.SessionRepository.insert(session).then(() => session.uuid);
  }
}
