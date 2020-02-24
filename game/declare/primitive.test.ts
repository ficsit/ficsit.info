import { declareString, declareInteger, declareBoolean, declareFloat } from "./primitive";

describe(`schema.declare.primitive`, () => {

  describe(`declareString`, () => {

    const schema = declareString();

    it(`passes string values`, () => {
      expect(schema.parse('foo')).toEqual('foo');
    });

    it(`strips \\r from string values`, () => {
      expect(schema.parse('foo\r\nbar\r\nbaz')).toEqual('foo\nbar\nbaz');
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

  });

  describe(`declareInteger`, () => {

    const schema = declareInteger();

    it(`passes integer values`, () => {
      expect(schema.parse('123')).toEqual(123);
    });

    it(`throws for fractional values`, () => {
      expect(() => {
        schema.parse('1.23');
      }).toThrowError(/1.23/);
    });

    it(`throws for values of the wrong type`, () => {
      expect(() => {
        schema.parse('foo');
      }).toThrowError(/foo/);
    });

    it(`throws for undefined`, () => {
      expect(() => {
        schema.parse(undefined);
      }).toThrowError(/undefined/);
    });

  });

  describe(`declareFloat`, () => {

    const schema = declareFloat();

    it(`passes float values`, () => {
      expect(schema.parse('1.23')).toEqual(1.23);
    });

    it(`throws for integer values`, () => {
      expect(() => {
        schema.parse('123');
      }).toThrowError(/123/);
    });

    it(`throws for values of the wrong type`, () => {
      expect(() => {
        schema.parse('foo');
      }).toThrowError(/foo/);
    });

    it(`throws for undefined`, () => {
      expect(() => {
        schema.parse(undefined);
      }).toThrowError(/undefined/);
    });

  });

  describe(`declareBoolean`, () => {

    const schema = declareBoolean();

    it(`passes True`, () => {
      expect(schema.parse('True')).toEqual(true);
    });

    it(`passes False`, () => {
      expect(schema.parse('False')).toEqual(false);
    });

    it(`throws for values of the wrong type`, () => {
      expect(() => {
        schema.parse('foo');
      }).toThrowError(/foo/);
    });

    it(`throws for undefined`, () => {
      expect(() => {
        schema.parse(undefined);
      }).toThrowError(/undefined/);
    });

  });

});
