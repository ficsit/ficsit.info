import { css } from '@emotion/core';

import { EntityAndRateChooser } from '~/components/EntityAndRateChooser';
import { sizing } from '~/style';

import { ItemRate } from './solve';

const targetStyles = css({
  paddingTop: sizing.Padding.Medium,
});

export interface TargetsChooserProps {
  targets: ItemRate[];
  setTargets: (newTargets: ItemRate[]) => void;
}

export function TargetsChooser({ targets, setTargets }: TargetsChooserProps) {
  return (
    <div>
      <h3>Production Targets</h3>
      <div>
        {targets.map((target, index) => (
          <EntityAndRateChooser
            key={index}
            css={targetStyles}
            target={target}
            setTarget={newTarget => {
              if (!newTarget) {
                setTargets(targets.filter((_t, i) => i !== index));
              } else {
                const newTargets = [...targets];
                newTargets[index] = newTarget;
                setTargets(newTargets);
              }
            }}
          />
        ))}
        <EntityAndRateChooser
          css={targetStyles}
          setTarget={newTarget => {
            if (!newTarget) return;
            setTargets([...targets, newTarget]);
          }}
        />
      </div>
    </div>
  );
}
