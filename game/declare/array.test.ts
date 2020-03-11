import { Declaration } from './Declaration';
import { declareArray } from './array';
import { declareInteger, declareString } from './primitive';
import { declareReference } from './reference';
import { declareStruct } from './struct';

describe(`schema.declare.array`, () => {
  describe(`declareArray`, () => {
    function itFollowsCommonBehavior(schema: Declaration<any[]>) {
      it(`handles empty arrays`, () => {
        const array = schema.parse(`()`);
        expect(array).toEqual([]);
      });

      it(`handles blank arrays`, () => {
        const array = schema.parse(``);
        expect(array).toEqual([]);
      });

      it(`throws for broken formats`, () => {
        expect(() => {
          schema.parse(`((foobar)`);
        }).toThrowError(/\(\(foobar\)/);
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
    }

    describe(`with a reference item`, () => {
      const schema = declareArray(declareReference());
      itFollowsCommonBehavior(schema);

      it(`passes simple references`, () => {
        const array = schema.parse(`(/foo/bar,/fizz/buzz,/fdsa/asdf)`);
        expect(array.map(e => e!.path)).toEqual(['/foo/bar', '/fizz/buzz', '/fdsa/asdf']);
      });

      it(`passes complex references`, () => {
        const array = schema.parse(`(/foo/bar,Class'/fizz/buzz',FizzClass'"/fdsa/asdf"')`);
        expect(array.map(e => e!.path)).toEqual(['/foo/bar', '/fizz/buzz', '/fdsa/asdf']);
      });
    });

    describe(`with a struct item`, () => {
      const schema = declareArray(
        declareStruct({
          foo: declareInteger(),
          bar: declareString(),
        }),
      );
      itFollowsCommonBehavior(schema);

      it(`passes single items`, () => {
        const array = schema.parse(`((foo=123,bar=asdf))`);
        expect(array).toEqual([{ foo: 123, bar: 'asdf' }]);
      });

      it(`passes multiple items`, () => {
        const array = schema.parse(`((foo=123,bar=asdf),(foo=1,bar=hi))`);
        expect(array).toEqual([
          { foo: 123, bar: 'asdf' },
          { foo: 1, bar: 'hi' },
        ]);
      });
    });
  });
});
