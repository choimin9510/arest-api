import { MethodType } from '@/decorators/controller.decorator';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export abstract class BaseController {
  private _router: Router;
  @inject(AuthMiddleware) private readonly authMiddleware: AuthMiddleware;

  get router() {
    if (!this._router) this._router = Router();

    return this._router;
  }

  private setRouter(path: string, method: MethodType, routeHandler: RequestHandler, isPublic: boolean) {
    if (!isPublic) {
      this.router.use(path, this.authenticate());
    }

    this.router[method](path, routeHandler);
  }

  private authenticate(): RequestHandler {
    return (request: Request, response: Response, next: NextFunction) => {
      this.authMiddleware.handle(request, response, next);
    };
  }
}
