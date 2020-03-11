import { declareStruct, declareFloat, DeclarationShape } from './declare';

/**
 * Schema for `FVector`.
 */
export const VectorSchema = declareStruct({
  X: declareFloat(),
  Y: declareFloat(),
  Z: declareFloat(),
});

export type Vector = DeclarationShape<typeof VectorSchema>;
