import { Recipe } from '@local/schema';

import { makeDataHook } from './fetch';

export function useRecipes() {
  return useRecipeData()?.bySlug;
}

export function useRecipe(slug?: string) {
  const recipes = useRecipes();
  return typeof slug === 'string' ? recipes?.[slug] : undefined;
}

export function useRecipesByProduct() {
  return useRecipeData()?.byProduct;
}

export function useRecipesByIngredient() {
  return useRecipeData()?.byIngredient;
}

// Raw Data

export const useRecipeData = makeDataHook(
  'recipes',
  (bySlug: Record<string, Recipe>) => {
    const recipes = Object.values(bySlug);
    return {
      bySlug,
      byProduct: _recipesByProduct(recipes),
      byIngredient: _recipesByIngredient(recipes),
    };
  },
);

function _recipesByProduct(recipes: Recipe[]) {
  const byProduct = Object.create(null) as Record<string, Recipe[]>;
  for (const recipe of recipes) {
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
}

function _recipesByIngredient(recipes: Recipe[]) {
  const byIngredient = Object.create(null) as Record<string, Recipe[]>;
  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      if (!byIngredient[ingredient.item]) byIngredient[ingredient.item] = [];
      byIngredient[ingredient.item].push(recipe);
    }
  }

  for (const [ingredient, recipes] of Object.entries(byIngredient)) {
    byIngredient[ingredient] = recipes.sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }

  return byIngredient;
}
