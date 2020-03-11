import {
  declareClass,
  DeclarationShape,
  declareString,
  declareArray,
  declareFloat,
  declareReference,
} from './declare';
import { ItemAmountSchema } from './ItemAmount';

/**
 * Schema for `FGRecipe`.
 *
 * This is a class describing a recipe, subclass this in blueprint to make a new
 * recipe.
 *
 * @see https://github.com/ficsit/community-resources/blob/master/Headers/FGRecipe.h
 */
export const RecipeSchema = declareClass('FGRecipe', {
  mDisplayName: declareString(),
  mIngredients: declareArray(ItemAmountSchema),
  mManualManufacturingMultiplier: declareFloat(),
  mManufactoringDuration: declareFloat(),
  mProducedIn: declareArray(declareReference()),
  mProduct: declareArray(ItemAmountSchema),
});

export type Recipe = DeclarationShape<typeof RecipeSchema>;
