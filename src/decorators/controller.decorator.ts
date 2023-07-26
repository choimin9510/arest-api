/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';

/**
 * 메타 타입
 */
enum MetaType {
  'PATH',
  'METHOD'
}

/**
 * 메소드 타입
 */
enum MethodType {
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE'
}

export function Controller() {
  return function (target: Function) {
    Object.getOwnPropertyNames(target.prototype).forEach((key) => {
      const routeHandler = target.prototype[key];
      const path = Reflect.getMetadata(MetaType.PATH, target.prototype, key);

      if (path) {
        target.prototype.setPath(path);
        target.prototype.setRouter(Router());
        target.prototype.router.get(path, routeHandler.bind(target.prototype));
      }
    });
  };
}

function Methods(methodType: MethodType) {
  return function (path: string) {
    return function (target: Object, key: string) {
      Reflect.defineMetadata(MetaType.PATH, path, target, key);
      Reflect.defineMetadata(MetaType.METHOD, methodType, target, key);
    };
  };
}

export const Get = Methods(MethodType.GET);
export const Post = Methods(MethodType.POST);
export const Put = Methods(MethodType.PUT);
export const Patch = Methods(MethodType.PATCH);
export const Delete = Methods(MethodType.DELETE);
