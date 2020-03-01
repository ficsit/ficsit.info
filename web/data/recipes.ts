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
  
  return byProduct;
});
