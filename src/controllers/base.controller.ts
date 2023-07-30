import { MethodType } from '@/decorators/controller.decorator';
import { RequestHandler, Router } from 'express';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController {
  private _router: Router;

  get router() {
    if (!this._router) this._router = Router();

    return this._router;
  }

  private setRouter(path: string, method: MethodType, routeHandler: RequestHandler) {
    this.router[method](path, routeHandler);
  }
}
