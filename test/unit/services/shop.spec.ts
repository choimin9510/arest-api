import { OwnerclanService } from '@/services/shop/ownerclan.service';
import { Container } from 'inversify';
import { BaseService, ServiceSymbols } from '@/services/base.service';
import Axios from 'axios';
import { UsePuppeteer } from '@/services/browser.service';
import dayjs from 'dayjs';
import { OrderListResult } from '@/interfaces/order.result';

let container: Container;
let cookies: string;
const SHOP_TEST_INFO = {
  [ServiceSymbols.ownerclan]: {
    id: process.env.OWNERCLAN_TEST_ID!,
    password: process.env.OWNERCLAN_TEST_PASSWORD!
  }
};

describe('ShopService', () => {
  beforeAll(async () => {
    container = new Container();
    cookies = '';

    const browser = await UsePuppeteer.createInstance({
      headless: 'new',
      defaultViewport: null,
      devtools: false,
      args: [
        '--no-sandbox', //
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36'
      ]
    });
    container.bind(ServiceSymbols.browser).toConstantValue(browser);
    container.bind(ServiceSymbols.http).toConstantValue(Axios);
    container.bind<OwnerclanService>(ServiceSymbols.ownerclan).to(OwnerclanService);
  });

  describe('login', () => {
    test('로그인 시 세션 아이디 반환 정상유무 체크', async () => {
      const shopService: BaseService = container.get(ServiceSymbols.ownerclan);
      cookies = await shopService.login(SHOP_TEST_INFO[ServiceSymbols.ownerclan].id, SHOP_TEST_INFO[ServiceSymbols.ownerclan].password);

      expect(cookies).not.toBe('');
    });
  });

  describe('login-check', () => {
    test('로그인 체크 Boolean Type 반환 정상유무 체크', async () => {
      const shopService: BaseService = container.get(ServiceSymbols.ownerclan);
      const result = await shopService.loginCheck(cookies);

      expect(result).toBe(true);
    });
  });

  describe('orderList', () => {
    test('주문리스트 조회 정상유무 체크', async () => {
      const shopService: BaseService = container.get(ServiceSymbols.ownerclan);
      const result = await shopService.orderList(cookies, {
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD')
      });

      // 오브젝트의 키 배열을 가져와서 특정 인터페이스와 키 배열이 같은지를 비교
      const expectedKeys: (keyof OrderListResult)[] = ['totalCnt', 'orders'];
      const actualKeys = Object.keys(result) as (keyof OrderListResult)[];

      expect(actualKeys).toEqual(expectedKeys);
    });
  });
});
