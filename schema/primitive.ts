/**
 * An identifier for something, appropriate for use in URL paths. kebab-case.
 * English.
 *
 * These are globally unique across all entities.
 */
export type Slug = string;

/**
 * A URI path pointing to some HTTP asset, relative to wherever this repository
 * is hosted.
 */
export type AssetPath = string;

/**
 * A string, containing content displayable to humans, in English.
 * 
 * E.g. this is something we could translate, later.
 */
export type HumanReadableString = string;

/**
 * A color, expressed as `#rrggbbaa`.
 */
export type Color = string;

/**
 * An item + count pair.
 */
export interface ItemAmount {
  item: Slug;
  count: number;
}

/**
 * The broad categorization of an entity.
 * 
 * Note that there are many sub types under each entity.
 */
export enum EntityKind {
  Building = 'building',
  Item = 'item',
  Recipe = 'recipe',
  Schematic = 'schematic',
}

/**
 * The form (physical state) of an item.
 */
export enum ItemForm {
  Solid = 'solid',
  Liquid = 'liquid',
  Gas = 'gas',
  Heat = 'heat',
}

/**
 * The maximum stack size of an item in an inventory.
 */
export enum ItemStackSize {
  One = 'one',
  Small = 'small',
  Medium = 'medium',
  Big = 'big',
  Huge = 'huge',
}

/**
 * An equipment slot on the player.
 */
export enum EquipmentSlot {
  Arms = 'arms',
  Body = 'body',
}

/**
 * kinds of schematics.
 */
export enum SchematicKind {
  Custom = 'custom',
  Tutorial = 'tutorial',
  Alternate = 'alternate',
  MAM = 'MAM',
  HardDrive = 'hardDrive',
  Milestone = 'milestone',
  ResourceSink = 'resourceSink',
}
