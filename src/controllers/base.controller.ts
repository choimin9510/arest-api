import { Router } from 'express';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController {
  private _path: string;
  private _router: Router;

  get path() {
    return this._path;
  }
  get router() {
    return this._router;
  }

  private setPath(path: string) {
    this._path = path;
  }

  private setRouter(router: Router) {
    this._router = router;
  }
}
