import { BaseController } from './base.controller';
import { Response } from 'express';
import { Controller, Get, Post } from '@/decorators/controller.decorator';
import { container } from '@/configs/inversify.config';
import { UseRequest } from '@/interfaces/use.request';
import { OrderListDto } from '@/interfaces/order.list.dto';
import { ResultResponse } from '@/interfaces/result.response';
import { OrderListResult } from '@/interfaces/order.result';

@Controller('order')
export class OrderController extends BaseController {
  @Post('/:sessionId')
  async orderList(request: UseRequest<OrderListDto>, response: Response) {
    const { shopCode, data: cookies } = request.session;

    const shopService = container.getShopService(shopCode);

    const orderListResult = await shopService.orderList(cookies, request.body);

    const result: ResultResponse<OrderListResult> = {
      result: 'success',
      data: orderListResult
    };

    response.send(result);
  }
}
