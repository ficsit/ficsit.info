import { ItemAmountSchema } from './ItemAmount';
import {
  declareClass,
  declareString,
  declareArray,
  declareEnum,
  declareBoolean,
  DeclarationShape,
} from './declare';

export const EquipmentSlotSchema = declareEnum(['ES_NONE', 'ES_ARMS', 'ES_BACK', 'ES_MAX'] as const);

/**
 * Schema for `FGEquipment`.
 *
 * Base class for all kinds of equipment in the game.
 *
 * @see https://github.com/ficsit/community-resources/blob/master/Headers/Equipment/FGEquipment.h
 */
export const EquipmentSchema = declareClass('FGEquipment', {
  mArmAnimation: declareString(),
  mAttachSocket: declareString(),
  mBackAnimation: declareString(),
  mCostToUse: declareArray(ItemAmountSchema),
  mEquipmentSlot: EquipmentSlotSchema,
  mHasPersistentOwner: declareBoolean(),
  mUseDefaultPrimaryFire: declareBoolean(),
});

export type Equipment = DeclarationShape<typeof EquipmentSchema>;
