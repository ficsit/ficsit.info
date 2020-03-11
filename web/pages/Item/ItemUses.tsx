import { Item } from '@local/schema';

import { RecipeTable } from '~/components/RecipeTable';
import { Section } from '~/components/Section';
import { useRecipesByIngredient } from '~/data';

export interface ItemUses {
  item: Item;
}

export function ItemUses({ item }: ItemUses) {
  const recipes = useRecipesByIngredient()?.[item.slug];
  if (!recipes) {
    return <Section title='Uses'>No recipes use {item.name} as an ingredient</Section>;
  }

  return (
    <Section title='Uses'>
      <RecipeTable recipes={recipes} showCounts={true} />
    </Section>
  );
}
