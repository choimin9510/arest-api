/* eslint-disable @typescript-eslint/no-explicit-any */

import { RequestHandler } from 'express';

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
export enum MethodType {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete'
}

/**
 * 라우트 정보
 */
export interface RouteInformation {
  /** 경로 */
  path: string;

  /** 메소드 타입 */
  methodType: MethodType;

  /** 실행함수 */
  action: RequestHandler;
}

export function Controller(prefix: string) {
  return <T extends { new (...args: any[]): any }>(target: T): any => {
    const routeInformationList: RouteInformation[] = [];

    Object.getOwnPropertyNames(target.prototype).forEach((key) => {
      const action = target.prototype[key];
      const path = Reflect.getMetadata(MetaType.PATH, target.prototype, key);
      const methodType = Reflect.getMetadata(MetaType.METHOD, target.prototype, key);

      if (path) {
        routeInformationList.push({
          path: '/' + prefix + path,
          methodType,
          action
        });
      }
    });

    const targetClass = class extends target {
      constructor(...args: any[]) {
        super(...args);

        for (const routeInformation of routeInformationList) {
          this.setRouter(routeInformation.path, routeInformation.methodType, routeInformation.action.bind(this));
        }
      }
    };

    return targetClass;
  };
}

function Methods(methodType: MethodType) {
  return function (path: string) {
    return function (target: any, key: string) {
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
