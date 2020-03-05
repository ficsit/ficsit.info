import { Recipe, AnyEntity } from '@local/schema';
import { css } from '@emotion/core';

import { colors, sizing } from '~/style';
import { ItemCount } from '~/components/ItemCount';

const iconSize = sizing.navListIconSize;

const recipeStyles = css({
  flex: 1,
  display: 'grid',
  gridTemplateRows: '[name] min-content [item] min-content [rate] min-content',
  gridAutoColumns: 'min-content',
  gridColumnGap: sizing.Padding.Normal,
});

const itemNameStyles = css({
  gridRow: 'name',
  margin: 0,
  fontSize: sizing.FontSize.Small,
  textAlign: 'center',
  paddingBottom: sizing.Padding.Small,
});

const itemRateStyles = css({
  gridRow: 'rate',
  margin: 0,
  paddingTop: sizing.Padding.Small,
  fontSize: sizing.FontSize.Small,
  textAlign: 'center',
  'span': {
    fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
});

const arrowStyles = css({
  display: 'flex',
  alignItems: 'center',
  fontSize: 36,
  color: colors.Light.N400,
  paddingLeft: 4,
});

export interface RecipeDetailsProps {
  recipe: Recipe;
  entities: Record<string, AnyEntity>;
  clockSpeed: number;
}

export function RecipeDetails({ recipe, entities, clockSpeed }: RecipeDetailsProps) {
  const { duration, ingredients, products, placedByPlayer } = recipe;

  const minutes = (duration / clockSpeed) / 60;

  return (
    <div css={recipeStyles}>
      {ingredients.map(({ item, count }) => 
        <React.Fragment key={item}>
          <p css={itemNameStyles}>{entities[item]?.name}</p>
          <ItemCount slug={item} count={count} size={iconSize} />
          {!placedByPlayer && 
            <p css={itemRateStyles}><span>{(count / minutes).toFixed(1)}</span> /<br />min</p>
          }
        </React.Fragment>
      )}
      <p css={itemNameStyles}></p>
      <div css={arrowStyles}>➤</div>
      <p css={itemRateStyles}></p>
      {products.map(({ item, count }) => 
        <React.Fragment key={item}>
          <p css={itemNameStyles}>{entities[item]?.name}</p>
          <ItemCount slug={item} count={count} size={iconSize} />
          {!placedByPlayer && 
            <p css={itemRateStyles}><span>{(count / minutes).toFixed(1)}</span> /<br />min</p>
          }
        </React.Fragment>
      )}
    </div>
  )
}
