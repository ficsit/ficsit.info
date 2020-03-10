import { css, SerializedStyles } from '@emotion/core';

import { colors, fonts, sizing } from '~/style';

import CycleTimeIcon from '~/assets/images/cycle-time.svg';
import PowerIcon from '~/assets/images/power.svg';

export const enum ValueUnit {
  None,
  CubitMeters = 'm³',
  Minutes = 'min',
  Megawatts = 'MW',
}

export interface ValueProps {
  value: number;
  unit: ValueUnit;
  denominator?: ValueUnit.Minutes;
  showIcon?: boolean;
}

const rootStyles = css({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: sizing.FontSize.Small,
  color: colors.Dark.N500,
});

const labelStyles = css({
  textAlign: 'center',
});

const valueStyles = css({
  fontFamily: fonts.Family.Monospace,
  fontSize: sizing.FontSize.Tiny,
  color: colors.Dark.N950,
});

const iconStyles = css({
  fill: colors.Dark.N500,
  width: sizing.inlineIconSize,
  height: sizing.inlineIconSize,
});

const iconAdjustmentStyles: Record<any, SerializedStyles> = {
  [ValueUnit.Megawatts]: css({
    marginRight: -6,
  }),
};

export function Value({
  value,
  unit,
  denominator,
  showIcon,
  ...props
}: ValueProps) {
  let title = `${value} ${unit}`;
  if (denominator) {
    title += ` / ${denominator}`;
  }

  if (unit === ValueUnit.CubitMeters) {
    value = value / 1e3;
  }

  let Icon;
  if (showIcon) {
    if (unit === ValueUnit.Minutes) {
      Icon = CycleTimeIcon;
    } else if (unit === ValueUnit.Megawatts) {
      Icon = PowerIcon;
    } else {
      throw new Error(`No icon available for ${unit}`);
    }
  }

  return (
    <div css={rootStyles} title={title} {...props}>
      {!!Icon && <Icon css={[iconStyles, iconAdjustmentStyles[unit]]} />}
      <div css={labelStyles}>
        <div>
          <span css={valueStyles}>{_prettyValue(value)}</span>
          {unit ? ` ${unit}` : ''}
        </div>
        {!!denominator && <div>/ {denominator}</div>}
      </div>
    </div>
  );
}

function _prettyValue(value: number) {
  const asString = value.toFixed(2);
  if (asString.endsWith('00')) return value.toFixed(0);
  if (asString.endsWith('0')) return value.toFixed(1);

  return `~${value.toFixed(1)}`;
}
