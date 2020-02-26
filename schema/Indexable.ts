import { ImageId, EntityKind, HumanReadableString, Slug } from './primitive';

/**
 * Any entity which should be indexed (e.g. for search, links, etc).
 * 
 * Most entities extend this.
 */
export interface Indexable {
  /**
   * The kind of entity that this is.
   */
  kind: EntityKind;

  /**
   * A globally unique identifier for the entity, expressed as a URI slug.
   */
  slug: Slug;

  /**
   * The item's name, displayed to humans.
   */
  name: HumanReadableString;

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
