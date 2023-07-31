import { DeliveryCompanyCode } from '@/interfaces/delivery.company.code';
import { OrderListDto } from '@/interfaces/order.list.dto';
import { OrderListResult } from '@/interfaces/order.result';
import { injectable } from 'inversify';
import { Dialog, Page, Protocol } from 'puppeteer';

/**
 * 배송사 정보 인터페이스
 */
export type DeliveryInfo = { deliveryCompanyCode: DeliveryCompanyCode; deliveryCompanyName: keyof typeof DeliveryCompanyCode };

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
   * 주문조회
   * @param orderListDto 주문조회 정보
   */
  abstract orderList(cookies: string, orderListDto: OrderListDto): Promise<OrderListResult>;

  /**
   * 쿠키정보 Array -> String
   * @param cookies 쿠키정보 (Array)
   * @returns 쿠키정보(String>
   */
  protected cookieArray2String(cookies: Protocol.Network.Cookie[]): string {
    return cookies.map((o) => `${o.name}=${o.value}`).join('; ');
  }

  /**
   * 배송사 정보 구하기
   * @param deliveryInfo 배송코드 or 배송사명
   */
  getDeliveryInfo(deliveryInfo: string): DeliveryInfo {
    const keys = Object.keys(DeliveryCompanyCode);
    const values = Object.values(DeliveryCompanyCode);
    const idx = keys.findIndex((o) => o === deliveryInfo);

    return { deliveryCompanyCode: values[idx], deliveryCompanyName: keys[idx] as keyof typeof DeliveryCompanyCode };
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
