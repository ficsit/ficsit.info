import { Recipe, ItemAmount } from '@local/schema';
import { css } from '@emotion/core';

import CraftingIcon from '~/assets/images/crafting.svg';

import { colors, sizing } from '~/style';
import { EntityReference } from '~/components/EntityReference';

const secondsPerClick = 0.25;
const clicksPerMinute = 60 / secondsPerClick;

const rootStyles = css({
  fontSize: sizing.FontSize.Small,
});

const titleStyles = css({
  margin: 0,
  fontWeight: 'normal',
});

const buildingStyles = css({
  padding: `${sizing.Padding.Medium}px 0`,
});

const iconStyles = css({
  fill: colors.Dark.N500,
  width: sizing.inlineIconSize,
  height: sizing.inlineIconSize,
  marginRight: sizing.Padding.Small,
});

const statsContainerStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
  borderTop: `1px solid ${colors.Light.N400}`,
  paddingTop: sizing.Padding.Medium,
});

const statsStyles = css({
  display: 'flex',
  flex: 1,
  alignItems: 'center',
});

export interface RecipeManualDetailsProps {
  recipe: Recipe;
}

export function RecipeManualDetails({ recipe }: RecipeManualDetailsProps) {
  if (!recipe.handcraftedIn?.length) return null;

  const clicks = Math.ceil((recipe.duration * recipe.manualMultiplier) / 2);

  return (
    <div css={rootStyles}>
      <h3 css={titleStyles}>Handcrafted In:</h3>
      <div css={buildingStyles}>
        {recipe.handcraftedIn.map(slug => (
          <EntityReference key={slug} slug={slug} />
        ))}
      </div>
      <div css={statsContainerStyles}>
        <div css={statsStyles}>
          <CraftingIcon css={iconStyles} />
          <div>{clicks}</div>
        </div>
        {recipe.products.map(itemAmount =>
          _renderProductsPerMinute(clicks, itemAmount),
        )}
      </div>
    </div>
  );
}

function _renderProductsPerMinute(clicks: number, { item, count }: ItemAmount) {
  const productPerMinute = (clicksPerMinute / clicks) * count;

  return (
    <div key={item}>
      <EntityReference slug={item} size={24} />
      <div>
        {productPerMinute.toFixed(1)} /<br />
        min
      </div>
    </div>
  );
}
