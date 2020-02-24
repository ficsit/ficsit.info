import { declareStruct, DeclarationShape, declareInteger } from "./declare";

/**
 * Schema for `FColor`.
 */
export const ColorSchema = declareStruct({
  R: declareInteger(),
  G: declareInteger(),
  B: declareInteger(),
  A: declareInteger(),
});

export type Color = DeclarationShape<typeof ColorSchema>;
