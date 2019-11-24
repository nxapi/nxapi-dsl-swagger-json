import path from 'path';
import { DSLReqDto, DSLController, httpMethods } from '@nxapi/nxapi';

export interface IRoute {
  description?: string;
  path?: string;
  httpMethod?: string;
  className?: string;
  classMethodName?: string;
  req?: DSLReqDto;
  dto?: DSLReqDto;
}

export const extractRoutes = (controllerDsls: DSLController[]) => {
  const routes: IRoute[] = [];
  controllerDsls.forEach(ctrl => {
    ctrl.classMethods.forEach(method => {
      httpMethods.forEach(hm => {
        if (!method[hm]) return;
        const route: IRoute = {};
        route.description = method['description'];
        route.path = path.join(
          '/',
          ctrl.path.substring(1, ctrl.path.length - 1),
          method[hm].substring(1, method[hm].length - 1)
        );
        route.httpMethod = hm;
        route.className = ctrl.className;
        route.classMethodName = method.classMethodName;
        route.req = method.req;
        route.dto = method.dto;
        routes.push(route);
      });
    });
  });
  return routes;
};
