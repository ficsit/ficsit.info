import { format } from 'util';

export function assertString(value: any): asserts value is string {
  _assertType(value, 'string');
}

export function assertObject(value: any): asserts value is Record<string, string> {
  _assertType(value, 'object');
  if (value === null) {
    throw new TypeAssertionError(value, `not be null`);
  }
}

export function assertRegexp(value: any, regexp: RegExp): asserts value is string {
  _assertType(value, 'string');
  if (!regexp.test(value)) {
    throw new TypeAssertionError(value, `match ${format(regexp)}`);
  }
}

export function assertOneOf<TValue>(value: any, range: readonly TValue[]): asserts value is TValue {
  if (!range.includes(value)) {
    throw new TypeAssertionError(value, `be one of ${format(range)}`);
  }
}

function _assertType(value: any, expected: any) {
  if (typeof value !== expected) {
    throw new TypeAssertionError(value, `be typeof ${expected}`);
  }
}

export class TypeAssertionError extends Error {
  constructor(value: any, assertion: string) {
    super(`Expected ${format(value)} to ${assertion}`);
  }
}
