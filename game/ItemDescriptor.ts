import { declareClass, DeclarationShape, declareBoolean, declareString, declareFloat, declareEnum, declareInteger } from './declare';
import { ColorSchema } from './Color';

/**
 * Schema for `EResourceForm`.
 */
export const ResourceFormSchema = declareEnum([
  'RF_INVALID',
  'RF_SOLID',
  'RF_LIQUID',
  'RF_GAS',
  'RF_HEAT',
  'RF_LAST_ENUM',
] as const);

/**
 * Schema for `EStackSize`.
 */
export const StackSizeSchema = declareEnum([
  'SS_ONE',
  'SS_SMALL',
  'SS_MEDIUM',
  'SS_BIG',
  'SS_HUGE',
  'SS_LAST_ENUM',	
  // Missing in the headers.
  'SS_FLUID',
] as const);

/**
 * Schema for `FGItemDescriptor`.
 * 
 * Base for all descriptors in the game like resource, equipment etc.
 * 
 * @see https://github.com/ficsit/community-resources/blob/master/Headers/Resources/FGItemDescriptor.h
 */
export const ItemDescriptorSchema = declareClass('FGItemDescriptor', {
  mCanBeDiscarded: declareBoolean(),
  mDescription: declareString(),
  mDisplayName: declareString(),
  mEnergyValue: declareFloat(),
  mFluidColor: ColorSchema,
  mFluidDensity: declareFloat(),
  mFluidFriction: declareFloat(),
  mFluidViscosity: declareFloat(),
  mForm: ResourceFormSchema,
  mRadioactiveDecay: declareFloat(),
  mRememberPickUp: declareBoolean(),
  mResourceSinkPoints: declareInteger(),
  mStackSize: StackSizeSchema,
});

export type ItemDescriptor = DeclarationShape<typeof ItemDescriptorSchema>;
