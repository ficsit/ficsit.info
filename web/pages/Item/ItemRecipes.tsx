import { Item, Recipe } from '@local/schema';
import { css } from '@emotion/core';
import { NavLink } from 'react-router-dom';

import { useRecipes, recipesByProduct } from '~/data';
import { colors, sizing } from '~/style';
import { entityUrl } from '~/routing';
import { Section } from '~/components/Section';
import { ItemCount } from '~/components/ItemCount';

const recipeStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  marginBottom: sizing.Padding.Normal,
  '&:last-of-type': {
    marginBottom: 0,
  }
});

const recipeTitleStyles = css({
  margin: 0,
  color: 'inherit',
  textDecoration: 'none',
  fontWeight: 'lighter',
  flexBasis: '100%',
  ':hover, &.active': {
    color: colors.Primary.N500,
  },
});

const recipeArrowStyles = css({
  fontSize: 24,
  color: colors.Light.N400,
  padding: `0 ${sizing.Padding.Small}px`,
});

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
      {recipes.map((recipe) => _renderRecipe(item, recipe))}
    </Section>
  );
}

function _renderRecipe(item: Item, recipe: Recipe) {
  let title;
  if (recipe.alternate) {
    title = recipe.name;
  } else if (recipe.products[0].item === item.slug) {
    title = `Standard Recipe`;
  } else {
    title = `Byproduct: ${recipe.name.replace(/^Alternative: /, '')}`
  }

  return (
    <div key={recipe.slug} css={recipeStyles}>
      <NavLink to={entityUrl(recipe)} css={recipeTitleStyles}>{title}</NavLink>
      <div>
        {recipe.ingredients.map(({ item, count }) => 
          <ItemCount key={item} slug={item} count={count} />
        )}
      </div>
      <div css={recipeArrowStyles}>➤</div>
      <div>
        {recipe.products.map(({ item, count }) => 
          <ItemCount key={item} slug={item} count={count} />
        )}
      </div>
    </div>
  )
}
