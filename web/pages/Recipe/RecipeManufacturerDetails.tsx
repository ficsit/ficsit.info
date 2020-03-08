import { Recipe, Building } from '@local/schema';
import { css } from '@emotion/core';
import { NavLink } from 'react-router-dom';

import { colors, sizing } from '~/style';
import { entityUrl } from '~/routing';
import { EntityImage } from '~/components/EntityImage';
import { ValueUnit, Value } from '~/components/Value';

const rootStyles = css({
  fontSize: sizing.FontSize.Small,
});

const linkStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: -sizing.Padding.Normal / 2,
});

const statsContainerStyles = css({
  display: 'flex',
  padding: `${sizing.Padding.Medium}px 0`,
});

const overclockContainerStyles = css({
  borderTop: `1px solid ${colors.Light.N400}`,
  paddingTop: sizing.Padding.Medium,
});

export interface RecipeManufacturerDetailsProps {
  recipe: Recipe;
  manufacturer?: Building;
  clockSpeed: number;
  setClockSpeed: (newSpeed: number) => void;
}

export function RecipeManufacturerDetails({
  recipe,
  manufacturer,
  clockSpeed,
  setClockSpeed,
}: RecipeManufacturerDetailsProps) {
  if (!manufacturer) return null;
  const { amount, exponent } = manufacturer.powerConsumption!;

  const duration = recipe.duration / clockSpeed;
  const powerUsage = amount * Math.pow(clockSpeed, exponent);

  return (
    <div css={rootStyles}>
      <NavLink to={entityUrl(manufacturer)} css={linkStyles}>
        <EntityImage entity={manufacturer} size={sizing.navListIconSize} />
      </NavLink>
      <div css={statsContainerStyles}>
        <Value unit={ValueUnit.Seconds} value={duration} showIcon />
        <Value unit={ValueUnit.Megawatts} value={powerUsage} showIcon />
      </div>
      <div css={overclockContainerStyles}>
        <input
          type='range'
          min={1}
          max={250}
          value={clockSpeed * 100}
          onChange={({ target }) => setClockSpeed(parseInt(target.value) / 100)}
        />
        <div>Clock Speed: {(clockSpeed * 100).toFixed(0)}%</div>
      </div>
    </div>
  );
}
