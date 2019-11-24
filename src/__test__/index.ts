import dslToJoi from '..';
import path from 'path';
import { compilerCtrlToDsl } from '@nxapi/nxapi';

const controllerPath = path.join('src', 'controllers');
const controllerDsls = compilerCtrlToDsl(controllerPath);

dslToJoi(controllerDsls, 'src/__tmp__');