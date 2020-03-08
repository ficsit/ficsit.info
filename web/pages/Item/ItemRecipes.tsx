import { Item, Recipe } from '@local/schema';

import { useRecipesByProduct } from '~/data';
import { Section } from '~/components/Section';
import { RecipeTable } from '~/components/RecipeTable';

export interface ItemRecipesProps {
  item: Item;
}

export function ItemRecipes({ item }: ItemRecipesProps) {
  const recipesByProduct = useRecipesByProduct();
  const recipes = recipesByProduct?.[item.slug];
  if (!recipes) {
    return <Section title='Recipes'>No recipes produce {item.name}</Section>;
  }

  return (
    <Section title='Recipes'>
      <RecipeTable
        recipes={recipes}
        renderTitle={recipe => _recipeTitle(item, recipe)}
        showCounts={true}
      />
    </Section>
  );
}

function _recipeTitle(item: Item, recipe: Recipe) {
  if (recipe.alternate) {
    return recipe.name;
  } else if (recipe.products[0].item === item.slug) {
    return `Standard Recipe`;
  } else {
    return `Byproduct: ${recipe.name.replace(/^Alternative: /, '')}`;
  }
}
