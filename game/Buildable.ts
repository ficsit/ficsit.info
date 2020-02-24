import { declareClass, declareBoolean, declareFloat, declareString, DeclarationShape } from './declare';
import { VectorSchema } from './Vector';

/**
 * Schema for `FGBuildable`.
 *
 * Base for everything buildable, buildable things can have factory connections,
 * power connections etc.
 * 
 * @see https://github.com/ficsit/community-resources/blob/master/Headers/Buildables/FGBuildable.h
 */
export const BuildableSchema = declareClass('FGBuildable', {
  mAllowCleranceSeparationEvenIfStackedOn: declareBoolean(),
  MaxRenderDistance: declareFloat(),
  mBuildEffectSpeed: declareFloat(),
  mDescription: declareString(),
  mDisplayName: declareString(),
  mForceNetUpdateOnRegisterPlayer: declareBoolean(),
  mHighlightVector: VectorSchema,
  mIsUseable: declareBoolean(),
  mShouldShowHighlight: declareBoolean(),
  mSkipBuildEffect: declareBoolean(),
});

export type Buildable = DeclarationShape<typeof BuildableSchema>;
