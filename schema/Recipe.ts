import { Data } from './Data';
import { ItemAmount, Slug } from './primitive';

/**
 * A recipe for producing something out of something.
 */
export interface Recipe extends Data {
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
   * Buildings the recipe can be produced by the player within.
   */
  handcraftedIn: Slug[];

  /**
   * Whether the player can place the product in the game world.
   */
  placedByPlayer?: true;

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
