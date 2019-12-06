import { d } from '@nxapi/nxapi';
import HelloReq from './hello-req';

export default class TestReq {
  @d.array.description('ddda')
  @d.array.required()
  @d.array.string.required()
  @d.array.string.example('arr item eq')
  arr: string[];

  // @d.object.required()
  // hello: HelloReq;

  @d.number.allow(1, 2)
  @d.number.invalid(1, 2, 5, 6)
  @d.number.max(1)
  @d.number.description('ddd')
  @d.number.example(1)
  tt: number;
  mmm: string;
  @d.boolean.example(true)
  b: boolean;
}
