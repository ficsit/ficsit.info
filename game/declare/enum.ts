import { Declaration } from './Declaration';
import { assertOneOf } from './assert';

export function declareEnum<TValues>(values: readonly TValues[]): Declaration<TValues> {
  return {
    parse(raw: any) {
      assertOneOf(raw, values);
      return raw;
    },
  };
}
