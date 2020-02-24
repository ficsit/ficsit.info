import { declareEnum } from './enum';

describe(`schema.declare.enum`, () => {

  describe(`declareEnum`, () => {

    const schema = declareEnum(['ONE', 'TWO', 'THREE']);

    it(`passes matching values`, () => {
      expect(schema.parse('ONE')).toEqual('ONE');
      expect(schema.parse('TWO')).toEqual('TWO');
      expect(schema.parse('THREE')).toEqual('THREE');
    });

    it(`throws for unknown values`, () => {
      expect(() => {
        schema.parse('FOUR');
      }).toThrowError(/FOUR/);
    });

    it(`mentions valid values for failures`, () => {
      expect(() => {
        schema.parse('FOUR');
      }).toThrowError(/ONE.*TWO.*THREE/);
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

});
