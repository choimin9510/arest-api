export enum OrderStatus {
  '신규주문',
  '상품준비중'
}

export class OrderListDto {
  /** 주문 상태 */
  orderStatus?: OrderStatus;

  /** 조회 시작 날짜 */
  startDate: string;

  /** 조회 종료 날짜 */
  endDate: string;
}
