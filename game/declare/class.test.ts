import { declareArray } from './array';
import { declareClass } from './class';
import { declareInteger, declareString } from './primitive';

describe(`schema.declare.class`, () => {
  describe(`declareClass`, () => {
    const schema = declareClass('FGFooBar', {
      foo: declareInteger(),
      bar: declareArray(declareInteger()),
      baz: declareString(),
    });

    it(`annotates the schema with the class name`, () => {
      expect(schema.className).toEqual('FGFooBar');
    });

    it(`passes simple items`, () => {
      const result = schema.parse({
        ClassName: 'abc123',
        foo: '123',
        bar: '(1,2,3)',
        baz: `hi`,
      });

      expect(result).toEqual({
        ClassName: 'abc123',
        foo: 123,
        bar: [1, 2, 3],
        baz: 'hi',
      });
    });

    it(`ignores extra keys`, () => {
      const result = schema.parse({
        ClassName: 'abc123',
        foo: '123',
        bar: '(1,2,3)',
        baz: `hi`,
        fizz: 'asdf',
      });

      expect(result).toEqual({
        ClassName: 'abc123',
        foo: 123,
        bar: [1, 2, 3],
        baz: 'hi',
      });
    });

    it(`throws for missing keys`, () => {
      expect(() => {
        schema.parse({ foo: '123' });
      }).toThrowError(/keys.*foo.*bar.*baz/);
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

    describe(`with a parent class`, () => {
      const childSchema = declareClass('FGChild', schema, {
        one: declareString(),
        two: declareArray(declareInteger()),
      });

      it(`annotates the schema with the class name`, () => {
        expect(childSchema.className).toEqual('FGChild');
      });

      it(`passes simple items`, () => {
        const result = childSchema.parse({
          ClassName: 'abc123',
          foo: '123',
          bar: '(1,2,3)',
          baz: `hi`,
          one: '1',
          two: '(1,2,3)',
        });

        expect(result).toEqual({
          ClassName: 'abc123',
          foo: 123,
          bar: [1, 2, 3],
          baz: 'hi',
          one: '1',
          two: [1, 2, 3],
        });
      });

      it(`throws for missing keys in the child`, () => {
        expect(() => {
          childSchema.parse({
            ClassName: 'abc123',
            foo: '123',
            bar: '(1,2,3)',
            baz: `hi`,
          });
        }).toThrowError(/keys.*one.*two/);
      });
    });
  });
});
