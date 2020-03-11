import { BuildableSchema } from './Buildable';
import { declareClass, declareBoolean, declareFloat, DeclarationShape, declareInteger } from './declare';

/**
 * Schema for `FGBuildableFactory`.
 *
 * Base class for factory machines like miners, conveyors, assemblers, storages
 * etc.
 *
 * @see https://github.com/ficsit/community-resources/blob/master/Headers/Buildables/FGBuildableFactory.h
 */
export const BuildableFactorySchema = declareClass('FGBuildableFactory', BuildableSchema, {
  mAddToSignificanceManager: declareBoolean(),
  mCanChangePotential: declareBoolean(),
  mEffectUpdateInterval: declareFloat(),
  mMaxPotential: declareFloat(),
  mMaxPotentialIncreasePerCrystal: declareFloat(),
  mMinimumProducingTime: declareFloat(),
  mMinimumStoppedTime: declareFloat(),
  mMinPotential: declareFloat(),
  mNumCyclesForProductivity: declareInteger(),
  mPowerConsumption: declareFloat(),
  mPowerConsumptionExponent: declareFloat(),
  mSignificanceBias: declareFloat(),
  mSignificanceRange: declareFloat(),
});

export type BuildableFactory = DeclarationShape<typeof BuildableFactorySchema>;
