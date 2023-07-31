import { ServiceSymbols } from '@/services/base.service';
import { UserService } from '@/services/user.service';
import { Response, NextFunction, Request } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthMiddleware {
  @inject(ServiceSymbols.user) private readonly userService: UserService;

  public async handle(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { sessionId } = request.params;
    const [session] = await this.userService.findSession(sessionId);

    request.session = session;
    next();
  }
}
