import { BuildableFactorySchema } from './BuildableFactory';
import { declareClass, DeclarationShape, declareFloat, declareInteger } from './declare';

/**
 * Schema for `FGBuildableStorage`.
 *
 * Base class for all storage boxes, large and small. May have an arbitrary
 * number of inputs and outputs.
 *
 * @see https://github.com/ficsit/community-resources/blob/master/Headers/Buildables/FGBuildableStorage.h
 */
export const BuildableStorageSchema = declareClass('FGBuildableStorage', BuildableFactorySchema, {
  mStackingHeight: declareFloat(),
  mInventorySizeX: declareInteger(),
  mInventorySizeY: declareInteger(),
});

export type BuildableStorage = DeclarationShape<typeof BuildableStorageSchema>;
