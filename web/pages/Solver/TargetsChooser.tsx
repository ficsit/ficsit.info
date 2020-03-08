import { EntityKind } from '@local/schema';

import { EntityChooser } from '~/components/EntityChooser';

import { ItemRate } from './solve';

export interface TargetsChooserProps {
  targets: ItemRate[];
  setTargets: (newTargets: ItemRate[]) => void;
}

export function TargetsChooser(props: TargetsChooserProps) {
  return (
    <div>
      <h3>Production Targets</h3>
      {props.targets.map((_target, index) => (
        <_Target key={index} {...props} index={index} />
      ))}
    </div>
  );
}

interface _TargetProps extends TargetsChooserProps {
  index: number;
}

function _Target({ targets, setTargets, index }: _TargetProps) {
  const { slug, perMinute } = targets[index];

  return (
    <div>
      <EntityChooser
        kind={EntityKind.Item}
        slug={slug}
        setSlug={newSlug => {
          const newTargets = [...targets];
          newTargets[index] = { ...targets[index], slug: newSlug };
          setTargets(newTargets);
        }}
      />
      <input
        value={perMinute || ''}
        type='text'
        pattern='\d*'
        onChange={event => {
          const newTargets = [...targets];
          newTargets[index] = {
            ...targets[index],
            perMinute: parseInt(event.target.value, 10) || 0,
          };
          setTargets(newTargets);
        }}
      />{' '}
      per min
    </div>
  );
}
