import { Item, Recipe } from '@local/schema';

import { useRecipes, recipesByProduct } from '~/data';
import { Section } from '~/components/Section';
import { RecipeTable } from '~/components/RecipeTable';

export interface ItemRecipesProps {
  item: Item;
}

export function ItemRecipes({ item }: ItemRecipesProps) {
  const allRecipes = useRecipes();
  if (!allRecipes) return <Section>Loading…</Section>;
  const recipes = recipesByProduct(allRecipes)[item.slug];
  if (!recipes) {
    return <Section title='Recipes'>No recipes produce {item.name}</Section>;
  }

  return (
    <RecipeTable 
      title='Recipes' 
      recipes={recipes} 
      recipeTitle={recipe => _recipeTitle(item, recipe)}
    />
  );
}

function _recipeTitle(item: Item, recipe: Recipe) {
  if (recipe.alternate) {
    return recipe.name;
  } else if (recipe.products[0].item === item.slug) {
    return `Standard Recipe`;
  } else {
    return `Byproduct: ${recipe.name.replace(/^Alternative: /, '')}`
  }
}
