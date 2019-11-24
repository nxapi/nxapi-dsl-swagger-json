import path from 'path';
import fs from 'fs';
import { DSLController } from '@nxapi/nxapi';
import { extractRoutes } from './route';
import { convertSwagger } from './convert-swagger';
import { Swagger } from './swagger-struct';

const saveSwaggerJson = (content: string, savePath: string) => {
  const targetPath = path.resolve(process.cwd(), savePath);
  const exists = fs.existsSync(targetPath);
  if (!exists) {
    fs.mkdirSync(targetPath);
  }
  fs.writeFileSync(path.resolve(targetPath, 'swagger.json'), content, 'utf8');
};

export default (controllerDsls: DSLController[], tmpRelativePath: string) => {
  const routes = extractRoutes(controllerDsls);
  const swagger = new Swagger();

  routes.forEach(route => {
    convertSwagger(swagger, route);

  });

  saveSwaggerJson(JSON.stringify(swagger), tmpRelativePath);
  console.log('nxapi-dsl-swagger-json success!');
};
