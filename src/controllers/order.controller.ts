import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { Controller, Get } from '@/decorators/controller.decorator';

@Controller('test')
export class OrderController extends BaseController {
  @Get('/2')
  private async test2(request: Request, response: Response) {
    response.send('test');
  }
}
