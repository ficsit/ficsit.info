import { Indexable } from './Indexable';
import { EntityKind, ItemAmount, Slug } from './primitive';

/**
 * A recipe for producing something out of something.
 */
export interface Recipe extends Indexable {
  kind: EntityKind.Recipe;

  /**
   * The inputs into the recipe.
   */
  ingredients: ItemAmount[];

  /**
   * The outputs from the recipe.
   */
  products: ItemAmount[];

  /**
   * Buildings the recipe can be produced within.
   */
  producedIn: Slug[];

  /**
   * Whether the recipe is a standard or alternate recipe.
   */
  alternate?: true;

  /**
   * How long it takes to produce one set of products.
   */
  duration: number;

  /**
   * Multiplier applied when hand crafting (in a workbench).
   */
  manualMultiplier: number;
}
