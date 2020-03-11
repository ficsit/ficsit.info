export interface Declaration<TShape = any> {
  parse(raw: any): TShape;
}

export type DeclarationShape<TDeclaration> = TDeclaration extends Declaration<infer TShape> ? TShape : never;

export type StructDeclaration<TStruct extends Record<string, Declaration>> = Declaration<
  {
    [TKey in keyof TStruct]: DeclarationShape<TStruct[TKey]>;
  }
>;
