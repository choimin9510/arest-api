import { IOrder } from './order';

/**
 * 주문조회 결과 IF
 */
export interface OrderListResult {
  /** 주문 건수 */
  totalCnt: number;

  /** 주문정보 */
  orders: IOrder[];
}
