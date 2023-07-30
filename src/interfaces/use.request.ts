import { Request } from 'express';

export interface UseRequest<T> extends Request {
  body: T;
}
