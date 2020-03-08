import { Recipe, ItemAmount, AnyEntity, ItemForm } from '@local/schema';
import { css } from '@emotion/core';
import { NavLink } from 'react-router-dom';

import { colors, sizing } from '~/style';
import { recipeUrl } from '~/routing';
import { ItemCount } from '~/components/ItemCount';
import { Rate, RateUnit } from './Rate';
import { useEntities } from '~/data';

const contentStyles = css({
  display: 'grid',
  gridColumnGap: sizing.Padding.Medium,
  gridRowGap: sizing.Padding.Medium,
  gridTemplateColumns: `
    [before] min-content [ingredients] max-content [arrow] max-content [products] max-content [after] 1fr
  `,
});

const recipeTitleStyles = css({
  gridColumn: '1 / -1',
  margin: 0,
  color: 'inherit',
  textDecoration: 'none',
  fontWeight: 'lighter',
  borderTop: `1px solid ${colors.Light.N100}`,
  paddingTop: sizing.Padding.Medium,
  '&:first-of-type': {
    paddingTop: 0,
    border: 'none',
  },
  ':hover, &.active': {
    color: colors.Primary.N500,
  },
});

const ingredientsStyles = css({
  display: 'flex',
  gridColumn: 'ingredients',
  justifyContent: 'flex-end',
});

const arrowStyles = css({
  display: 'flex',
  gridColumn: 'arrow',
  alignItems: 'center',
  fontSize: 24,
  height: 56,
  color: colors.Light.N400,
  paddingLeft: 3,
});

const productsStyles = css({
  display: 'flex',
  gridColumn: 'products',
});

const entityStyles = css({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: sizing.Padding.Medium,
  '&:first-of-type': {
    marginLeft: 0,
  },
});

export interface RecipeTableProps {
  recipes: Recipe[];
  renderTitle?: (recipe: Recipe) => string | undefined;
  showCounts?: boolean;
  showRates?: boolean | ((recipe: Recipe) => number);
  size?: number;
}

export function RecipeTable(props: RecipeTableProps) {
  const entities = useEntities();
  if (!entities) return null;

  return (
    <div css={contentStyles}>
      {props.recipes.map(r => _renderRecipe(r, props, entities))}
    </div>
  );
}

function _renderRecipe(
  recipe: Recipe,
  props: RecipeTableProps,
  entities: Record<string, AnyEntity>,
) {
  const title = props.renderTitle ? props.renderTitle(recipe) : recipe.name;
  const itemHeight =
    (props.size || sizing.navButtonIconSize) + sizing.Padding.Small * 2;

  return (
    <React.Fragment key={recipe.slug}>
      {!!title && (
        <NavLink to={recipeUrl(recipe)} css={recipeTitleStyles}>
          {title}
        </NavLink>
      )}
      <div css={ingredientsStyles}>
        {recipe.ingredients.map(i =>
          _renderEntity(recipe, entities[i.item], i, props),
        )}
      </div>
      <div css={arrowStyles} style={{ height: itemHeight }}>
        ➤
      </div>
      <div css={productsStyles}>
        {recipe.products.map(i =>
          _renderEntity(recipe, entities[i.item], i, props),
        )}
      </div>
    </React.Fragment>
  );
}

function _renderEntity(
  recipe: Recipe,
  entity: AnyEntity | undefined,
  { item, count }: ItemAmount,
  { size, showCounts = false, showRates = false }: RecipeTableProps,
) {
  const { duration } = recipe;
  let multiple = 1.0;
  if (typeof showRates === 'function') {
    multiple = showRates(recipe);
  }

  const isLiquid =
    entity && 'form' in entity && entity.form === ItemForm.Liquid;

  return (
    <div key={item} css={entityStyles}>
      <ItemCount slug={item} count={showCounts && count} size={size} />
      {!!showRates && (
        <Rate
          unit={RateUnit.Minutes}
          rate={{ count, duration, multiple }}
          isLiquid={isLiquid}
        />
      )}
    </div>
  );
}
