import { css } from '@emotion/core';

import { sizing, colors } from '~/style';

const rootStyles = css({
  display: 'inline-block',
  fontSize: sizing.FontSize.Small,
  color: colors.Dark.N500,
  textAlign: 'center',
});

const rateStyles = css({
  fontFamily:
    'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontSize: sizing.FontSize.Tiny,
  color: colors.Dark.N950,
});

export const enum RateUnit {
  Minutes = 'min',
}

export interface ManufacturingRate {
  count: number;
  duration: number;
  multiple?: number;
}

export interface RateProps {
  rate: number | ManufacturingRate;
  unit: RateUnit;
  isLiquid?: boolean;
}

export function Rate({ rate, unit, isLiquid }: RateProps) {
  if (typeof rate !== 'number') {
    const basis = 60;
    rate = (basis / rate.duration) * rate.count * (rate.multiple || 1.0);
  }

  let rateUnit = '';
  if (isLiquid) {
    rateUnit = ' ml³';
    rate = rate / 1e3;
  }

  return (
    <div css={rootStyles} title={`${rate}${rateUnit} / ${unit}`}>
      <div>
        <span css={rateStyles}>{_prettyRate(rate)}</span>
        {rateUnit}
      </div>
      <div>/ {unit}</div>
    </div>
  );
}

function _prettyRate(value: number) {
  const asString = value.toFixed(2);
  if (asString.endsWith('00')) return value.toFixed(0);
  if (asString.endsWith('0')) return value.toFixed(1);

  return `~${value.toFixed(1)}`;
}
