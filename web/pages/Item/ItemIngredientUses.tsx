import { Item } from '@local/schema';

import { useRecipes, recipesByIngredient } from '~/data';
import { Section } from '~/components/Section';
import { RecipeTable } from '~/components/RecipeTable';

export interface ItemIngredientUsesProps {
  item: Item;
}

export function ItemIngredientUses({ item }: ItemIngredientUsesProps) {
  const allRecipes = useRecipes();
  if (!allRecipes) return <Section>Loading…</Section>;
  const recipes = recipesByIngredient(allRecipes)[item.slug];
  if (!recipes) {
    return <Section title='Recipes'>No recipes use {item.name} as an ingredient</Section>;
  }

  return (
    <RecipeTable 
      title='Recipe Uses' 
      recipes={recipes} 
    />
  );
}
