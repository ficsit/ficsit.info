import { HumanReadableString, Slug } from './primitive';

/**
 * An instance of some type of data (abstract).
 */
export interface Data {
  /**
   * A globally unique identifier for the entity, expressed as a URI slug and
   * derived from its English name.
   */
  slug: Slug;

  /**
   * The item's name, displayed to humans.
   */
  name: HumanReadableString;
}
