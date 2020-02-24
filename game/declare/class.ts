import { format } from 'util';

import { Declaration, StructDeclaration } from './Declaration';
import { declareString } from './primitive';
import { assertObject, TypeAssertionError } from './assert';

type ClassStruct<TClass> = TClass & { ClassName: Declaration<string> };

interface ClassDeclaration<
  TName extends string = string,
  TClass extends Record<string, Declaration> = Record<string, Declaration>
> extends StructDeclaration<ClassStruct<TClass>> {
  className: TName;
}

export function declareClass<
  TName extends string, 
  TClass extends Record<string, Declaration>
>(
  className: TName,
  declaration: TClass
): ClassDeclaration<TName, TClass>;

export function declareClass<
  TName extends string, 
  TClass extends Record<string, Declaration>,
  TParent extends Record<string, Declaration>
>(
  className: TName,
  parent: ClassDeclaration<string, TParent>,
  declaration: TClass
): ClassDeclaration<TName, TParent & TClass>;

export function declareClass<
  TName extends string, 
  TClass extends Record<string, Declaration>,
  TParent extends Record<string, Declaration>
>(
  className: TName,
  declarationOrParent: ClassDeclaration<string, TParent>,
  maybeDeclaration?: TClass
): ClassDeclaration<TName, TParent & TClass> {
  const declaration = {
    ...(maybeDeclaration || declarationOrParent),
    ClassName: declareString(), 
  }

  const parent = maybeDeclaration ? declarationOrParent : undefined;

  const requiredKeys = new Set();
  for (const [key, itemDeclaration] of Object.entries(declaration)) {
    if ('optional' in itemDeclaration && itemDeclaration.optional) continue;
    requiredKeys.add(key);
  }

  return {
    className,

    parse(raw: any) {
      assertObject(raw);
      
      const values: any = parent ? parent.parse(raw) : {};
      for (const [key, itemDeclaration] of Object.entries(declaration)) {
        if (!(key in raw)) {
          if (requiredKeys.has(key)) {
            throw new TypeAssertionError(raw, `to have keys: ${format(Array.from(requiredKeys))} (missing ${key})`);
          } else {
            continue;
          }
        }

        values[key] = itemDeclaration.parse(raw[key]);
      }

      return values;
    }
  };
}
