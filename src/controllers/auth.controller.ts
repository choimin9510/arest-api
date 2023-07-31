import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { Controller, Get, Post } from '@/decorators/controller.decorator';
import { UseRequest } from '@/interfaces/use.request';
import { LoginDto } from '@/interfaces/auth.dto';
import { container } from '@/configs/inversify.config';
import { ResultResponse } from '@/interfaces/result.response';
import { inject } from 'inversify';
import { ServiceSymbols } from '@/services/base.service';
import { UserService } from '@/services/user.service';
import { Public } from '@/decorators/public.decorator';
import { LoginCheckResult, LoginResult } from '@/interfaces/auth.result';

@Controller('auth')
export class AuthController extends BaseController {
  @inject(ServiceSymbols.user) private readonly userService: UserService;

  @Public()
  @Post('/login')
  async login(request: UseRequest<LoginDto>, response: Response) {
    const { shopCode, id, password } = request.body;
    const shopService = container.getShopService(shopCode);

    const cookies = await shopService.login(id, password);
    const sessionId = await this.userService.saveSession(shopCode, cookies);

    const result: ResultResponse<LoginResult> = {
      result: 'success',
      data: {
        sessionId
      }
    };

    response.send(result);
  }

  @Get('/login-check/:sessionId')
  async loginCheck(request: Request, response: Response) {
    const { shopCode, data: cookies, uuid: sessionId } = request.session;
    const shopService = container.getShopService(shopCode);

    const isLogin = await shopService.loginCheck(cookies);

    const result: ResultResponse<LoginCheckResult> = {
      result: 'success',
      data: {
        sessionId,
        shopCode,
        login: isLogin
      }
    };

    response.send(result);
  }
}
