import { BuildableFactorySchema } from './BuildableFactory';
import { declareClass, declareFloat, DeclarationShape } from './declare';

/**
 * Schema for `FGBuildableManufacturer`.
 *
 * Base class for all buildings that are producing something out of something,
 * i.e. constructors, smelters, refinery etc.
 *
 * @see https://github.com/ficsit/community-resources/blob/master/Headers/Buildables/FGBuildableManufacturer.h
 */
export const BuildableManufacturerSchema = declareClass('FGBuildableManufacturer', BuildableFactorySchema, {
  mManufacturingSpeed: declareFloat(),
});

export type BuildableManufacturer = DeclarationShape<typeof BuildableManufacturerSchema>;
