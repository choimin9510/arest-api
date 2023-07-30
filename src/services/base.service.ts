import { injectable } from 'inversify';
import { Dialog, Page, Protocol } from 'puppeteer';

export const ServiceSymbols = {
  user: Symbol.for('user'),
  ownerclan: 'ownerclan',
  http: Symbol.for('http'),
  browser: Symbol.for('browser')
} as const;

@injectable()
export abstract class BaseService {
  baseUrl: string;

  /**
   * 로그인 함수
   * @returns 쿠키정보(string)
   */
  public abstract login(id: string, password: string): Promise<string>;

  /**
   * 로그인 체크
   * @param cookies 쿠키정보
   * @returns 로그인 성공 여부(성공: true, false: 실패)
   */
  public abstract loginCheck(cookies: string): Promise<boolean>;

  /**
   * 쿠키정보 Array -> String
   * @param cookies 쿠키정보 (Array)
   * @returns 쿠키정보(String>
   */
  protected cookieArray2String(cookies: Protocol.Network.Cookie[]): string {
    return cookies.map((o) => `${o.name}=${o.value}`).join('; ');
  }

  /**
   * 다이얼로그 이벤트 등록
   * @param page 페이지 인스턴스
   * @param cb 이벤트 콜백 함수
   */
  protected onDialog(page: Page, cb: (dialog: Dialog) => void) {
    page.on('dialog', async (dialog) => {
      cb(dialog);
    });
  }
}
