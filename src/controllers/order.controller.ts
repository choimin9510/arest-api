import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { Controller, Get } from '@/decorators/controller.decorator';

@Controller()
export class OrderController extends BaseController {
  @Get('/orderList')
  private orderList(request: Request, response: Response) {
    response.send('not found');
  }
}
