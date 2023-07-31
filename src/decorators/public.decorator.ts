/* eslint-disable @typescript-eslint/no-explicit-any */

import { MetaType } from './controller.decorator';

export function Public() {
  return function (target: any, key: string) {
    Reflect.defineMetadata(MetaType.PUBLIC, true, target, key);
  };
}
