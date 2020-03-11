import { declareArray } from './array';
import { declareStruct } from './struct';
import { declareInteger, declareBoolean } from './primitive';
import { declareReference } from './reference';
import { declareOptional } from './optional';

describe(`schema.declare.struct`, () => {
  describe(`declareStruct`, () => {
    const schema = declareStruct({
      ClassName: declareReference(),
      Amount: declareInteger(),
    });

    it(`passes simple items`, () => {
      const result = schema.parse(`(ClassName=Foo'"/a/b/c"',Amount=27)`);
      expect(result.Amount).toEqual(27);
      expect(result.ClassName!.kind).toEqual('Foo');
      expect(result.ClassName!.path).toEqual('/a/b/c');
    });

    it(`ignores extra keys`, () => {
      const result = schema.parse(`(ClassName=Foo'"/a/b/c"',Amount=27,Foo=asdf)`);
      expect(result.Amount).toEqual(27);
      expect(result.ClassName!.kind).toEqual('Foo');
      expect(result.ClassName!.path).toEqual('/a/b/c');
    });

    it(`throws for missing keys`, () => {
      expect(() => {
        schema.parse(`(Amount=27)`);
      }).toThrowError(/keys.*ClassName.*Amount/);
    });

    it(`throws for broken formats`, () => {
      expect(() => {
        schema.parse(`((ClassName=Foo'"/a/b/c"',Amount=27)`);
      }).toThrowError(/\(\(/);
    });

    it(`throws for values of the wrong type`, () => {
      expect(() => {
        schema.parse(1);
      }).toThrowError(/1/);
    });

    it(`throws for undefined`, () => {
      expect(() => {
        schema.parse(undefined);
      }).toThrowError(/undefined/);
    });

    describe(`with arrays`, () => {
      const schema = declareStruct({
        foo: declareArray(declareInteger()),
        bar: declareInteger(),
      });

      it(`passes items with array values`, () => {
        const result = schema.parse(`(foo=(1,2,3),bar=4)`);
        expect(result).toEqual({ foo: [1, 2, 3], bar: 4 });
      });

      it(`passes items with empty array values`, () => {
        const result = schema.parse(`(foo=(),bar=4)`);
        expect(result).toEqual({ foo: [], bar: 4 });
      });
    });

    describe(`with optional values`, () => {
      const schema = declareStruct({
        foo: declareOptional(declareInteger()),
        bar: declareOptional(declareBoolean()),
      });

      it(`passes all values`, () => {
        const result = schema.parse(`(foo=1,bar=False)`);
        expect(result).toEqual({ foo: 1, bar: false });
      });

      it(`passes with some missing keys`, () => {
        const result = schema.parse(`(bar=False)`);
        expect(result).toStrictEqual({ bar: false });
      });

      it(`passes with all missing keys`, () => {
        const result = schema.parse(`()`);
        expect(result).toEqual({});
      });
    });
  });
});
