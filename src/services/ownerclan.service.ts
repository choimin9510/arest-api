import { inject, injectable } from 'inversify';
import { BaseService, ServiceSymbols } from './base.service';
import { UseBrowser } from './browser.service';
import { Axios } from 'axios';

@injectable()
export class OwnerclanService extends BaseService {
  baseUrl: string;
  @inject(ServiceSymbols.browser) private readonly browser: UseBrowser;
  @inject(ServiceSymbols.http) private readonly http: Axios;

  constructor() {
    super();
    this.baseUrl = 'https://ownerclan.com';
  }

  /**
   * 로그인 함수
   * @returns 쿠키정보(string)
   */
  public async login(id: string, password: string): Promise<string> {
    const page = await this.browser.newSessionPage();

    this.onDialog(page, (dialog) => {
      dialog.dismiss();
    });

    await page.goto(this.baseUrl + '/V2/member/loginform.php');
    await page.type('#id', id);
    await page.type('#passwd', password);

    const loginPromise = page.waitForResponse((res) => res.url() === this.baseUrl + '/V2/member/login.php', { timeout: 5000 });
    await page.click('input[type="submit"]');

    await loginPromise;

    const cookies = this.cookieArray2String(await page.cookies());
    const isLogin = await this.loginCheck(cookies);

    return isLogin ? cookies : '';
  }

  /**
   * 로그인 체크
   * @returns 로그인 성공 여부(성공: true, false: 실패)
   */
  public async loginCheck(cookies: string): Promise<boolean> {
    const { data }: { data: string } = await this.http.get(this.baseUrl + '/V2/member/loginform.php', {
      headers: {
        cookie: cookies
      }
    });

    return data.includes('이미로그인 되어있습니다.');
  }
}
