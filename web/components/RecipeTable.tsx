import { Recipe } from '@local/schema';
import { css } from '@emotion/core';
import { NavLink } from 'react-router-dom';

import { colors, sizing } from '~/style';
import { recipeUrl } from '~/routing';
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
  '> *': {
    marginLeft: sizing.Padding.Medium,
    '&:first-of-type': {
      marginLeft: 0,
    },
  },
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
  '> *': {
    marginLeft: sizing.Padding.Medium,
    '&:first-of-type': {
      marginLeft: 0,
    },
  },
});

export interface RecipeTableProps {
  title: string;
  recipes: Recipe[];
  recipeTitle?: (recipe: Recipe) => string;
}

export function RecipeTable({ title, recipes, recipeTitle }: RecipeTableProps) {
  return (
    <Section title={title}>
      <div css={contentStyles}>
        {recipes.map((recipe) => _renderRecipe(recipe, recipeTitle))}
      </div>
    </Section>
  );
}

function _renderRecipe(recipe: Recipe, recipeTitle?: (recipe: Recipe) => string) {
  const title = recipeTitle ? recipeTitle(recipe) : recipe.name;

  return (
    <React.Fragment key={recipe.slug}>
      <NavLink to={recipeUrl(recipe)} css={recipeTitleStyles}>{title}</NavLink>
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
