import { Item, Recipe } from '@local/schema';
import { css } from '@emotion/core';
import { NavLink } from 'react-router-dom';

import { useRecipes, recipesByProduct } from '~/data';
import { colors, sizing } from '~/style';
import { entityUrl } from '~/routing';
import { Section } from '~/components/Section';
import { ItemCount } from '~/components/ItemCount';

const contentStyles = css({
  display: 'grid',
  gridAutoColumns: 'max-content',
  gridColumnGap: sizing.Padding.Medium,
});

const recipeTitleStyles = css({
  gridColumn: '1 / 5',
  margin: 0,
  marginTop: sizing.Padding.Normal,
  color: 'inherit',
  textDecoration: 'none',
  fontWeight: 'lighter',
  '&:first-of-type': {
    marginTop: 0,
  },
  ':hover, &.active': {
    color: colors.Primary.N500,
  },
});

const ingredientsStyles = css({
  gridColumn: '1 / 2',
  textAlign: 'right',
});

const arrowStyles = css({
  display: 'flex',
  alignItems: 'center',
  gridColumn: '2 / 3',
  fontSize: 24,
  color: colors.Light.N400,
  paddingLeft: 3,
});

const productsStyles = css({
  gridColumn: '3 / 4',
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
      <div css={contentStyles}>
        {recipes.map((recipe) => _renderRecipe(item, recipe))}
      </div>
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
    <React.Fragment key={recipe.slug}>
      <NavLink to={entityUrl(recipe)} css={recipeTitleStyles}>{title}</NavLink>
      <div css={ingredientsStyles}>
        {recipe.ingredients.map(({ item, count }) => 
          <ItemCount key={item} slug={item} count={count} />
        )}
      </div>
      <div css={arrowStyles}>➤</div>
      <div css={productsStyles}>
        {recipe.products.map(({ item, count }) => 
          <ItemCount key={item} slug={item} count={count} />
        )}
      </div>
    </React.Fragment>
  )
}
