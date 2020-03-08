import { Item } from '@local/schema';

import { useRecipesByIngredient } from '~/data';
import { Section } from '~/components/Section';
import { RecipeTable } from '~/components/RecipeTable';

export interface ItemUses {
  item: Item;
}

export function ItemUses({ item }: ItemUses) {
  const recipes = useRecipesByIngredient()?.[item.slug];
  if (!recipes) {
    return (
      <Section title='Recipes'>
        No recipes use {item.name} as an ingredient
      </Section>
    );
  }

  return (
    <Section title='Recipe Uses'>
      <RecipeTable recipes={recipes} showCounts={true} />
    </Section>
  );
}
