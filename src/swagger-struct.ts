export class Swagger {
  swagger?: string = '2.0';
  host?: string = '';
  basePath?: string = '/';
  schemes?: string[] = [];
  info?: any = { title: '接口文档', version: '0.0.1' };
  paths?: object = {};
}

export class SwaggerRoute {
  get?: HttpMethod;
  post?: HttpMethod;
  put?: HttpMethod;
  delete?: HttpMethod;
}

export class HttpMethod {
  summary?: string;
  operationId?: string;
  tags?: string[] = [];
  parameters?: Parameter[] = [];
  responses?: {
    200?: {
      schema?: Parameter;
      description?: string;
    }
  } = { 200: { schema: {}, description: 'Successful' } };
}

export class Parameter {
  required?: any;
  type?: string;
  name?: string;
  in?: string;
  description?: string;
  example?: string;
  schema?: Parameter;
  items?: Parameter;
  properties?: object = {};

  //...
}
