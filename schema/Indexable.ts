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
   * Path to an icon of the entity, to be displayed along side its name.
   */
  icon?: ImageId;

  /**
   * Any categories (within its kind) this entity is contained within.
   * 
   * Categories are in order of specificity (and imply a hierarchy).
   */
  categories?: HumanReadableString[];
}
