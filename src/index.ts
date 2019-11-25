import path from 'path';
import fs from 'fs';
import { DSLController } from '@nxapi/nxapi';
import { extractRoutes } from './route';
import { convertSwagger } from './convert-swagger';
import { Swagger } from './swagger-struct';

const createSwaggerDir = () => {
  const srcStaticDir = path.join(process.cwd(), 'static');
  if (!fs.existsSync(srcStaticDir)) fs.mkdirSync(srcStaticDir);
  const srcSwaggerDir = path.join(srcStaticDir, 'swagger');
  if (!fs.existsSync(srcSwaggerDir)) fs.mkdirSync(srcSwaggerDir);
  return srcSwaggerDir;
};

const saveSwaggerJson = (content: string, savePath: string) => {
  const dir = createSwaggerDir();
  fs.writeFileSync(path.join(dir, 'swagger.json'), content, 'utf8');
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
