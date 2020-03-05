import { Recipe, Building } from '@local/schema';
import { css } from '@emotion/core';
import { NavLink } from 'react-router-dom';

import CycleTimeIcon from '~/assets/images/cycle-time.svg';
import PowerIcon from '~/assets/images/power.svg';

import { colors, sizing } from '~/style';
import { entityUrl } from '~/routing';
import { EntityImage } from '~/components/EntityImage';

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

const statsStyles = css({
  display: 'flex',
  flex: 1,
  alignItems: 'center',
});

const iconStyles = css({
  fill: colors.Dark.N500,
  width: sizing.inlineIconSize,
  height: sizing.inlineIconSize,
  marginRight: sizing.Padding.Small,
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

export function RecipeManufacturerDetails({ recipe, manufacturer, clockSpeed, setClockSpeed }: RecipeManufacturerDetailsProps) {
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
        <div css={statsStyles}>
          <CycleTimeIcon css={iconStyles} />
          <div>{duration.toFixed(1)}<br />secs</div>
        </div>
        <div css={statsStyles}>
          <PowerIcon css={iconStyles} />
          <div>{powerUsage.toFixed(1)}<br />MW</div>
        </div>
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
  )

}
