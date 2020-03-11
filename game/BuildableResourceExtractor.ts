import {
  declareClass,
  DeclarationShape,
  declareFloat,
  declareInteger,
  declareArray,
  declareReference,
  declareBoolean,
  declareStruct,
} from './declare';
import { BuildableFactorySchema } from './BuildableFactory';
import { ResourceFormSchema } from './ItemDescriptor';
import { declareOptional } from './declare/optional';

/**
 * Schema for `FGBuildableResourceExtractor`.
 *
 * Base for all generators, i.e. coal, fuel, nuclear etc.
 *
 * @see https://github.com/ficsit/community-resources/blob/master/Headers/Buildables/FGBuildableResourceExtractor.h
 */
export const BuildableResourceExtractorSchema = declareClass(
  'FGBuildableResourceExtractor',
  BuildableFactorySchema,
  {
    mAllowedResourceForms: declareArray(ResourceFormSchema),
    mAllowedResources: declareArray(declareReference()),
    mExtractCycleTime: declareFloat(),
    mExtractStartupTime: declareFloat(),
    mItemsPerCycle: declareInteger(),
    mOnlyAllowCertainResources: declareBoolean(),
    mParticleMap: declareOptional(
      declareArray(
        declareStruct({
          ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3: declareReference(),
          ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD: declareReference(),
        }),
      ),
    ),
  },
);

export type BuildableResourceExtractor = DeclarationShape<typeof BuildableResourceExtractorSchema>;
