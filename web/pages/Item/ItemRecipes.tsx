import { Item } from '@local/schema';

import { useRecipes, recipesByProduct } from '~/data';
import { Section } from '~/components/Section';

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
    <Section title='Recipes'>
      {recipes.map((recipe) =>
        <pre key={recipe.slug}>{JSON.stringify(recipe, null, 2)}</pre>
      )}
    </Section>
  );
}
