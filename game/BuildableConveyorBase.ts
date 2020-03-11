import { BuildableSchema } from './Buildable';
import { declareClass, declareFloat, DeclarationShape } from './declare';
import { declareOptional } from './declare/optional';

/**
 * Schema for `FGBuildableConveyorBase`.
 *
 * Base class for factory machines like miners, conveyors, assemblers, storages
 * etc.
 *
 * @see https://github.com/ficsit/community-resources/blob/master/Headers/Buildables/FGBuildableConveyorBase.h
 */
export const BuildableConveyorBaseSchema = declareClass('FGBuildableConveyorBase', BuildableSchema, {
  mMeshHeight: declareOptional(declareFloat()),
  mMeshLength: declareOptional(declareFloat()),
  mSpeed: declareFloat(),
});

export type BuildableConveyorBase = DeclarationShape<typeof BuildableConveyorBaseSchema>;
