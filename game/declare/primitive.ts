import { assertOneOf, assertRegexp, assertString } from './assert';
import { Declaration } from './Declaration';

export function declareString(): Declaration<string> {
  return {
    parse(raw: any) {
      assertString(raw);
      return raw.replace(/\r\n/g, '\n');
    }
  }
}

export function declareInteger(): Declaration<number> {
  return {
    parse(raw: any) {
      assertRegexp(raw, /^-?\d+$/);
      return parseInt(raw);
    }
  }
}

export function declareFloat(): Declaration<number> {
  return {
    parse(raw: any) {
      assertRegexp(raw, /^-?\d+\.\d+$/);
      return parseFloat(raw);
    }
  }
}

export function declareBoolean(): Declaration<boolean> {
  return {
    parse(raw: any) {
      assertOneOf(raw, ['True', 'False']);
      return raw === 'True';
    }
  }
}
