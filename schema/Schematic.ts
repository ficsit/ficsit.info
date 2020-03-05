import { Data } from './Data';
import { SchematicKind, ItemAmount, Slug } from './primitive';

/**
 * Research the player can perform (trading post, M.A.M, etc).
 */
export interface Schematic extends Data {
  /**
   * The specific type of schematic.
   */
  schematicKind: SchematicKind;

  /**
   * The requirements to unlock the schematic.
   */
  cost: ItemAmount[];

  /**
   * Entities unlocked by the schematic.
   */
  unlocks: Slug[];

  /**
   * The tech tier of the schematic.
   */
  tier: number;

  /**
   * Any other schematics that must be researched first, if any.
   */
  dependencies?: Slug[];

  /**
   * How far the ship travels after unlocking, if any.
   */
  shipTravelTime?: number;
}
