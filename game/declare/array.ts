import { assertString, TypeAssertionError, assertRegexp } from './assert';
import { Declaration } from './Declaration';

export function declareArray<TItem>(itemDeclaration: Declaration<TItem>): Declaration<TItem[]> {
  return {
    parse(raw: any) {
      assertString(raw);
      if (raw === '') return [];
      assertRegexp(raw, /^\(.*\)$/);

      const items = parseRawArray(raw);
      return items.map(i => itemDeclaration.parse(i));
    },
  };
}

// Stupid basic tokenization + parsing.
function parseRawArray(raw: string) {
  const items = [] as string[];
  let current = '';
  let depth = 0;

  function push() {
    if (current.length === 0) return;
    items.push(current);
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
    } else {
      current += character;
    }
  }

  if (depth !== 0) {
    throw new TypeAssertionError(raw, `be a valid array`);
  }

  return items;
}
