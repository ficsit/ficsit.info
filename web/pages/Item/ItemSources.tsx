import { Item, Recipe } from '@local/schema';

import { useRecipesByProduct } from '~/data';
import { Section } from '~/components/Section';
import {
  RecipeTable,
  ExtractionDetails,
  isExtraction,
} from '~/components/RecipeTable';

export interface ItemSourcesProps {
  item: Item;
}

export function ItemSources({ item }: ItemSourcesProps) {
  const recipesByProduct = useRecipesByProduct();
  if (!recipesByProduct) return null;
  const recipes = recipesByProduct?.[item.slug];
  const extractions = item.resource?.extractedBy?.map(slug => ({
    item: item.slug,
    building: slug,
  }));

  return (
    <Section title='Sources'>
      <RecipeTable
        extractions={extractions}
        recipes={recipes}
        renderTitle={recipe => _recipeTitle(item, recipe)}
        showCounts={true}
      />
    </Section>
  );
}

function _recipeTitle(item: Item, recipe: Recipe | ExtractionDetails) {
  if (isExtraction(recipe) || recipe.alternate) {
    return recipe.name;
  } else if ('products' in recipe && recipe.products[0].item === item.slug) {
    return `Standard Recipe`;
  } else {
    return `Byproduct: ${recipe.name.replace(/^Alternative: /, '')}`;
  }
}
