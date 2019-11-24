import { IRoute } from './route';

import JoiKeys from './joi-keys';
import { hashCode, DSLReqDto, DSLField } from '@nxapi/nxapi';
import { Swagger, SwaggerRoute, HttpMethod, Parameter } from './swagger-struct';

export const convertSwagger = (swagger: Swagger, route: IRoute) => {
  let swaggerRoute = null;
  if (swagger.paths[route.path]) swaggerRoute = swagger.paths[route.path];
  else {
    swaggerRoute = new SwaggerRoute();
    swagger.paths[route.path] = swaggerRoute;
  }
  const httpMethod = new HttpMethod();
  httpMethod.summary = route.description;
  httpMethod.operationId = route.path;
  swaggerRoute[route.httpMethod] = httpMethod;
  if (route.httpMethod === 'get' || route.httpMethod === 'delete') {
    const params = dealGetDeleteReq(route.req);
    httpMethod.parameters.push(...params);
  } else {
    const param = new Parameter();
    param.in = 'body';
    param.name = 'body';
    param.schema = dealReqDto(route.req);
    httpMethod.parameters.push(param);
  }
  httpMethod.responses[200].schema = dealReqDto(route.dto);

};
const dealGetDeleteReq = (reqDto: DSLReqDto) => {
  const params: Parameter[] = [];
  reqDto.fields.forEach((field: DSLField) => {
    const param = new Parameter();
    param.description = field['description'];
    param.example = field.example;
    param.in = 'query';
    param.name = field.name;
    param.type = field.type;
    param.required = field.required;
    params.push(param);
  });
  return params;
};

const dealReqDto = (reqDto: DSLReqDto) => {
  const rootParam = new Parameter();
  if (reqDto.isArray) {
    rootParam.type = 'array';
    rootParam.items = new Parameter();
    if (isBaseType(reqDto.type)) {
      rootParam.items.type = reqDto.type;
    }
  } else if (isBaseType(reqDto.type)) {
    rootParam.type = reqDto.type;
  }
  //下面逻辑为自定义对象处理逻辑
  if (!reqDto.fields) return rootParam;
  rootParam.type = 'object';
  rootParam.required = [];
  const properties = {};
  reqDto.fields.forEach((field: DSLField) => {
    const param = new Parameter();
    param.description = field['description'];
    const joiType = getJoiType(field.type);
    if (field.isArray) {
      param.type = 'array';
      param.items = new Parameter();
      param.items.type = joiType;
      if (joiType === 'object') {
        const childParam = dealReqDto(field.typeDeclare);
        param.items.properties = childParam.properties;
      } else {
        // param.items.type = joiType;
      }
    } else {
      param.type = joiType;
      if (joiType === 'object') {
        const childParam = dealReqDto(field.typeDeclare);
        param.properties = childParam.properties;
      } else {
        param.example = field.example;
      }
    }
    properties[field.name] = param;
    field.required && rootParam.required.push(field.name);
  });
  rootParam.properties = properties;
  return rootParam;
};

const getJoiType = (typeName: string) => {
  const types = ['number', 'string', 'boolean', 'object', 'any', 'array'];
  if (types.includes(typeName)) return typeName;
  return 'object';
};

const isBaseType = (typeName: string) => {
  const types = ['number', 'string', 'boolean', 'object', 'Object', 'any'];
  return types.includes(typeName);
};
