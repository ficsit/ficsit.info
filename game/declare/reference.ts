import { Reference } from '../Reference';

import { Declaration } from './Declaration';
import { assertString, TypeAssertionError } from './assert';

export function declareReference(): Declaration<Reference | undefined> {
  return {
    parse(raw: string) {
      assertString(raw);

      if (raw === 'None') return;

      const match = /^([^'"]+)'"?(.+?)"?'$/.exec(raw);
      if (match) return new Reference(match[2], match[1]);

      if (raw.startsWith('/')) return new Reference(raw);

      throw new TypeAssertionError(raw, `to match a known reference format`);
    },
  };
}
