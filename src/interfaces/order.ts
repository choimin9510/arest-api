import { DeliveryCompanyCode } from './delivery.company.code';

export interface IOrder {
  /** 주문번호 */
  orderNo: string;

  /** 상품 주문번호 */
  productOrderNo?: string;

  /** 묶음번호 */
  shipmentBoxNo?: string;

  /** 상품명 */
  prodName: string;

  /** 옵션명 */
  optName?: string;

  /** 주문 수량 */
  quantity: number;

  /** 수령자명 */
  recipientName: string;

  /** 수령자주소1 */
  address1?: string;

  /** 수령자주소2 */
  address2?: string;

  /** 수령자 연락처1 */
  tel1?: string;

  /** 수령자 연락처2 */
  tel2?: string;

  /** 뱅송 메세지 */
  shippingMessage?: string;

  /** 우편번호 */
  zipCode: string;

  /** 송장번호 */
  trackingNumber?: string;

  /** 배송사 코드 */
  deliveryCompanyCode?: DeliveryCompanyCode;

  /** 배송사 이름 */
  deliveryCompanyName?: keyof typeof DeliveryCompanyCode;

  /** 상품코드 */
  productCode?: string;

  /** 판매자관리코드 */
  manageCode?: string;
}
