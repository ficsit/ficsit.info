import { EntityKind } from '@local/schema';
import { css } from '@emotion/core';

import { EntityChooser } from '~/components/EntityChooser';
import { colors } from '~/style';

import { ItemRate } from './solve';

const targetStyles = css({
  display: 'flex',
});

const inputContainerStyles = css({
  position: 'relative',
  alignItems: 'center',
  width: '6.25em',
  border: `2px solid ${colors.Light.N400}`,
  borderTopRightRadius: 4,
  borderBottomRightRadius: 4,
  marginLeft: -2,
  backgroundColor: colors.Light.N100,
  '&:hover': {
    border: `2px solid ${colors.Primary.N500}`,
    zIndex: 10,
  },
});

const countStyles = css({
  position: 'relative',
  border: 'none',
  outline: 'none',
  textAlign: 'right',
  height: '100%',
  width: '100%',
  paddingRight: '3em',
  backgroundColor: 'transparent',
  zIndex: 10,
});

const unitLabelStyles = css({
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  zIndex: 5,
  paddingRight: '0.5em',
  color: colors.Dark.N500,
});

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
    <div css={targetStyles}>
      <EntityChooser
        kind={EntityKind.Item}
        slug={slug}
        setSlug={newSlug => {
          const newTargets = [...targets];
          newTargets[index] = { ...targets[index], slug: newSlug };
          setTargets(newTargets);
        }}
      />
      <div css={inputContainerStyles}>
        <input
          css={countStyles}
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
        />
        <div css={unitLabelStyles}> / min</div>
      </div>
    </div>
  );
}
