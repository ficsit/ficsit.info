import { assertOneOf } from './assert';
import { Declaration } from './Declaration';

export function declareEnum<TValues>(values: readonly TValues[]): Declaration<TValues> {
  return {
    parse(raw: any) {
      assertOneOf(raw, values);
      return raw;
    },
  };
}
