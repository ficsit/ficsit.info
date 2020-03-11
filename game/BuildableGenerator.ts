import { BuildableFactorySchema } from './BuildableFactory';
import { ResourceFormSchema } from './ItemDescriptor';
import {
  declareClass,
  DeclarationShape,
  declareReference,
  declareArray,
  declareBoolean,
  declareFloat,
  declareInteger,
} from './declare';
import { declareOptional } from './declare/optional';

/**
 * Schema for `FGBuildableGenerator`.
 *
 * Base for all generators, i.e. coal, fuel, nuclear etc.
 *
 * @see https://github.com/ficsit/community-resources/blob/master/Headers/Buildables/FGBuildableGenerator.h
 */
export const BuildableGeneratorSchema = declareClass('FGBuildableGenerator', BuildableFactorySchema, {
  // TODO: This is a mess of all of the generator classes - should we specialize?
  mDefaultFuelClasses: declareOptional(declareArray(declareReference())),
  mFuelResourceForm: declareOptional(ResourceFormSchema),
  mRequiresSupplementalResource: declareOptional(declareBoolean()),
  mSupplementalLoadAmount: declareOptional(declareInteger()),
  mSupplementalToPowerRatio: declareOptional(declareFloat()),
  mPowerProduction: declareFloat(),
  mPowerProductionExponent: declareFloat(),
});

export type BuildableGenerator = DeclarationShape<typeof BuildableGeneratorSchema>;
