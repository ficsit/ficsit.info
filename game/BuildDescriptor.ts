import { declareClass, declareFloat, DeclarationShape, declareArray, declareReference } from './declare';
import { ItemDescriptorSchema } from './ItemDescriptor';

/**
 * Schema for `FGBuildDescriptor`.
 *
 * Base class for factory machines like miners, conveyors, assemblers, storages 
 * etc.
 * 
 * @see https://github.com/ficsit/community-resources/blob/master/Headers/Resources/FGBuildDescriptor.h
 */
export const BuildDescriptorSchema = declareClass('FGBuildDescriptor', ItemDescriptorSchema, {
  mSubCategories: declareArray(declareReference()),
  mBuildMenuPriority: declareFloat(),
});

export type BuildDescriptor = DeclarationShape<typeof BuildDescriptorSchema>;
