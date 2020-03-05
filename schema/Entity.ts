import { Data } from './Data';
import { ImageId, HumanReadableString } from './primitive';

/**
 * The broad categorization of an entity.
 * 
 * Note that there are many sub types under each entity.
 */
export enum EntityKind {
  Building = 'building',
  Item = 'item',
}

/**
 * Any entity which should be indexed (e.g. for search, links, etc).
 * 
 * Most entities extend this.
 */
export interface Entity extends Data {
  /**
   * The kind of entity that this is.
   */
  kind: EntityKind;

  /**
   * Path to an transparent image of the entity.
   */
  icon?: ImageId;

  /**
   * Any categories (within its kind) this entity is contained within.
   * 
   * Categories are in order of specificity (and imply a hierarchy).
   */
  categories?: HumanReadableString[];

  /**
   * The order of this item when displayed within lists.
   */
  listOrder?: number;
}
