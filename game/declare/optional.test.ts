import { declareOptional } from './optional';
import { declareString } from './primitive';

describe(`schema.declare.optional`, () => {
  describe(`declareString`, () => {
    const schema = declareOptional(declareString());

    it(`passes values`, () => {
      expect(schema.parse('foo')).toEqual('foo');
    });

    it(`passes undefined`, () => {
      expect(schema.parse(undefined)).toEqual(undefined);
    });
  });
});
