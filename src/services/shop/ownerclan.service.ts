import { inject, injectable } from 'inversify';
import { BaseService, ServiceSymbols } from '../base.service';
import { UseBrowser } from '../browser.service';
import { Axios } from 'axios';
import { OrderListDto } from '@/interfaces/order.list.dto';
import { IOrder } from '@/interfaces/order';
import { OrderListResult } from '@/interfaces/order.result';

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

  /**
   * 주문조회
   * @param orderListDto 주문조회 정보
   */
  async orderList(cookies: string, orderListDto: OrderListDto): Promise<OrderListResult> {
    const orders: IOrder[] = [];
    const { data } = await this.http.post(
      this.baseUrl + '/V2/_ajax/getOrderList.php',
      {
        outputType: 'json',
        pageNum: 1,
        listNum: 1000,
        ordGbn: 'A',
        startDate: orderListDto.startDate,
        finishDate: orderListDto.endDate,
        deliType: 'N,S,Y,E,D,C,B,R,Z', // 전체
        // deliType: 'Y', // 배송중
        searchType: 'al',
        searchKeyword: '',
        sortType: 'orderDate',
        dateType: 1,
        deliLate: 'N'
      },
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          cookie: cookies
        }
      }
    );

    for (const order of data.orderList) {
      for (const product of order.productList) {
        const deliveryInfo = this.getDeliveryInfo(product.deliCom);

        orders.push({
          orderNo: order.orderCode,
          prodName: product.productName,
          optName: `${product.opt1_name}${product.opt2_name ? ` / ${product.opt2_name}` : ''}`,
          quantity: product.quantity,
          recipientName: order.receiverName,
          trackingNumber: product.deliNum,
          deliveryCompanyCode: deliveryInfo.deliveryCompanyCode,
          deliveryCompanyName: deliveryInfo.deliveryCompanyName,
          zipCode: order.receiverAddr.match(/우편번호\s*:\s*([0-9]+)/)[1],
          productCode: product.selfcode,
          manageCode: product.selfcode
        });
      }
    }

    return { totalCnt: orders.length, orders };
  }
}
