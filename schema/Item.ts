import { Indexable } from './Indexable';
import { Color, EntityKind, ItemAmount, ItemForm, ItemStackSize, HumanReadableString, EquipmentSlot } from './primitive';

/**
 * Items that can be placed in inventories (resources, equipment, etc).
 */
export interface Item extends Indexable {
  kind: EntityKind.Item;

  /**
   * A detailed description of the building.
   */
  description: HumanReadableString;

  /**
   * The form of the item.
   */
  form: ItemForm;

  /**
   * The maximum stack size of the item, if stackable.
   */
  stackSize?: ItemStackSize;

  /**
   * If the item is a fluid, provides details about that.
   */
  fluid?: ItemFluidDetails;
  
  /**
   * If the item is radioactive, provides details about that.
   */
  radioactivity?: ItemRadioactivityDetails;

  /**
   * If the item is a fuel, provides details about that.
   */
  fuel?: ItemFuelDetails;

  /**
   * If the item can be equipped, provides details about that.
   */
  equipment?: ItemEquipmentDetails;
}

/**
 * Details about fluids.
 */
export interface ItemFluidDetails {
  /**
   * The color of the fluid.
   */
  color: Color;
}

/**
 * Details about radioactive items.
 */
export interface ItemRadioactivityDetails {
  /**
   * The radioactive decay rate of this item.
   */
  decay: number;
}

/**
 * Details about fuels.
 */
export interface ItemFuelDetails {
  /**
   * Amount of energy provided by an instance of this item.
   */
  energy: number;
}

/**
 * Details about equipment.
 */
export interface ItemEquipmentDetails {
  /**
   * The slot the item can be equipped into.
   */
  slot: EquipmentSlot;

  /**
   * The cost to use the item, if any.
   */
  cost?: ItemAmount[];
}
