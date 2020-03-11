import { ValueUnit, Value } from './Value';

export interface ManufacturingRate {
  count: number;
  duration: number;
  multiple?: number;
}

export interface RateProps {
  rate: number | ManufacturingRate;
  isLiquid?: boolean;
}

export function Rate({ rate, isLiquid, ...props }: RateProps) {
  if (typeof rate !== 'number') {
    const basis = 60;
    rate = (basis / rate.duration) * rate.count * (rate.multiple || 1.0);
  }

  const valueUnit = isLiquid ? ValueUnit.CubitMeters : ValueUnit.None;

  return <Value value={rate} unit={valueUnit} denominator={ValueUnit.Minutes} {...props} />;
}
