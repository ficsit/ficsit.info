import { Declaration } from './Declaration';

export interface OptionalDeclaration<TShape = any> extends Declaration<TShape | undefined> {
  optional: true;
}

export function declareOptional<TShape>(declaration: Declaration<TShape>): OptionalDeclaration<TShape> {
  return {
    optional: true,
    parse(raw: any) {
      return raw === undefined ? undefined : declaration.parse(raw);
    },
  };
}
