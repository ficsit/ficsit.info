import { format } from 'util';

import { Declaration, StructDeclaration } from './Declaration';
import { assertString, assertRegexp, TypeAssertionError } from './assert';
import { OptionalDeclaration } from './optional';

export function declareStruct<TStruct extends Record<string, Declaration | OptionalDeclaration>>(
  declaration: TStruct,
): StructDeclaration<TStruct> {
  const requiredKeys = new Set();
  for (const [key, itemDeclaration] of Object.entries(declaration)) {
    if ('optional' in itemDeclaration && itemDeclaration.optional) continue;
    requiredKeys.add(key);
  }

  return {
    parse(raw: any) {
      assertString(raw);
      assertRegexp(raw, /^\(.*\)$/);

      const rawValues = parseRawObject(raw);
      const values = {} as any;
      for (const [key, itemDeclaration] of Object.entries(declaration)) {
        if (!(key in rawValues)) {
          if (requiredKeys.has(key)) {
            throw new TypeAssertionError(
              raw,
              `to have keys: ${format(Array.from(requiredKeys))} (missing ${key})`,
            );
          } else {
            continue;
          }
        }

        values[key] = itemDeclaration.parse(rawValues[key]);
      }

      return values;
    },
  };
}

// Stupid basic tokenization + parsing.
function parseRawObject(raw: string) {
  const values = {} as Record<string, string>;
  let key = '';
  let current = '';
  let depth = 0;

  function push() {
    if (current.length === 0) return;
    values[key] = current;
    key = '';
    current = '';
  }

  for (let i = 0; i < raw.length; i++) {
    const character = raw[i];

    if (character === '(') {
      depth += 1;
    } else if (character === ')') {
      depth -= 1;
    }

    if (depth === 1 && character === '(') {
      // skip the character.
    } else if (depth === 0 && character === ')') {
      push();
    } else if (depth === 1 && character === ',') {
      push();
    } else if (depth === 1 && character === '=') {
      key = current;
      current = '';
    } else {
      current += character;
    }
  }

  if (depth !== 0) {
    throw new TypeAssertionError(raw, `be a valid object`);
  }

  return values;
}
