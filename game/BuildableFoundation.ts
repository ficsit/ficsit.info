import { BuildableSchema } from './Buildable';
import { declareClass, declareBoolean, declareFloat, DeclarationShape, declareStruct } from './declare';
import { declareOptional } from './declare/optional';

/**
 * Disable snapping on specific sides.
 */
export const FoundationSideSelectionFlagsSchema = declareStruct({
  Front: declareOptional(declareBoolean()),
  Right: declareOptional(declareBoolean()),
  Back: declareOptional(declareBoolean()),
  Left: declareOptional(declareBoolean()),
  Top: declareOptional(declareBoolean()),
  Bottom: declareOptional(declareBoolean()),
});

/**
 * Schema for `FGBuildableFoundation`.
 *
 * A foundation to build your factory walls and floors on.
 *
 * @see https://github.com/ficsit/community-resources/blob/master/Headers/Buildables/FGBuildableFoundation.h
 */
export const BuildableFoundationSchema = declareClass('FGBuildableFoundation', BuildableSchema, {
  mSize: declareFloat(),
  mHeight: declareFloat(),
  mDisableSnapOn: FoundationSideSelectionFlagsSchema,
});

export type BuildableFoundation = DeclarationShape<typeof BuildableFoundationSchema>;
