import {
  declareClass,
  declareArray,
  declareReference,
  declareString,
  declareFloat,
  declareInteger,
  declareEnum,
} from './declare';
import { ItemAmountSchema } from './ItemAmount';

/**
 * Schema for `SchematicType`.
 */
export const SchematicTypeSchema = declareEnum([
  'EST_Custom',
  'EST_Cheat',
  'EST_Tutorial',
  'EST_Research',
  'EST_Alternate',
  'EST_Story',
  'EST_TradingPostUpgrade',
  'EST_MAM',
  // Missing in the headers.
  'EST_HardDrive',
  'EST_Milestone',
  'EST_ResourceSink',
] as const);

/**
 * Schema for `FGSchematic`.
 *
 * This is a schematic. It is purchased in the trading post and grants the player resources and/or recipes.
 *
 * @see https://github.com/ficsit/community-resources/blob/master/Headers/FGSchematic.h
 */
export const SchematicSchema = declareClass('FGSchematic', {
  mAdditionalSchematicDependencies: declareArray(declareReference()),
  mCost: declareArray(ItemAmountSchema),
  mDisplayName: declareString(),
  mTimeToComplete: declareFloat(),
  mSubCategories: declareArray(declareReference()),
  mTechTier: declareInteger(),
  mType: SchematicTypeSchema,
  mUnlocks: declareArray(declareReference()),
});
