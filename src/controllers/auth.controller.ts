import { BaseController } from './base.controller';
import { Response } from 'express';
import { Controller, Post } from '@/decorators/controller.decorator';
import { UseRequest } from '@/interfaces/use.request';
import { LoginDto, LoginResult } from '@/interfaces/auth.dto';
import { container } from '@/configs/inversify.config';
import { ResultResponse } from '@/interfaces/result.response';
import { inject } from 'inversify';
import { ServiceSymbols } from '@/services/base.service';
import { UserService } from '@/services/user.service';

@Controller('auth')
export class AuthController extends BaseController {
  @inject(ServiceSymbols.user) private readonly userService: UserService;

  @Post('/login')
  private async login(request: UseRequest<LoginDto>, response: Response) {
    const { shopCode, id, password } = request.body;
    const shopService = container.getShopService(shopCode);

    const cookies = await shopService.login(id, password);
    const sessionId = await this.userService.saveSession(cookies);

    const result: ResultResponse<LoginResult> = {
      result: 'success',
      data: {
        sessionId
      }
    };

    response.send(result);
  }
}
