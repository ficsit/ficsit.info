import { Recipe } from '@local/schema';

import { memoize } from '~/utility';

export const recipesByProduct = memoize((recipes: Record<string, Recipe>) => {
  const byProduct = Object.create(null) as Record<string, Recipe[]>;
  for (const recipe of Object.values(recipes)) {
    for (const product of recipe.products) {
      if (!byProduct[product.item]) byProduct[product.item] = [];
      byProduct[product.item].push(recipe);
    }
  }

  for (const [product, recipes] of Object.entries(byProduct)) {
    byProduct[product] = recipes
      .sort((a, b) => a.name.localeCompare(b.name))
      .sort((a, b) => {
        if (a.alternate === b.alternate) return 0;
        return a.alternate && !b.alternate ? 1 : -1;
      })
      .sort((a, b) => {
        if (a.products[0].item === b.products[0].item) return 0;
        return a.products[0].item === product ? -1 : 1;
      });
  }
  
  return byProduct;
});

export const recipesByIngredient = memoize((recipes: Record<string, Recipe>) => {
  const byIngredient = Object.create(null) as Record<string, Recipe[]>;
  for (const recipe of Object.values(recipes)) {
    for (const ingredient of recipe.ingredients) {
      if (!byIngredient[ingredient.item]) byIngredient[ingredient.item] = [];
      byIngredient[ingredient.item].push(recipe);
    }
  }

  for (const [ingredient, recipes] of Object.entries(byIngredient)) {
    byIngredient[ingredient] = recipes
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  
  return byIngredient;
});
