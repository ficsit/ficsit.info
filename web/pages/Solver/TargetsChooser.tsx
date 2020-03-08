import { EntityKind } from '@local/schema';
import { css } from '@emotion/core';

import CancelIcon from '~/assets/images/cancel.svg';
import { EntityChooser } from '~/components/EntityChooser';
import { colors, sizing } from '~/style';

import { ItemRate } from './solve';

const listStyles = css({
  paddingTop: sizing.Padding.Medium,
});

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

const cancelStyles = css({
  display: 'flex',
  padding: 12,
  cursor: 'pointer',
  svg: {
    height: 16,
    width: 16,
    fill: colors.Light.N400,
  },
  '&:hover svg': {
    fill: colors.Primary.N500,
  },
});

const cancelIconStyles = css({});

export interface TargetsChooserProps {
  targets: ItemRate[];
  setTargets: (newTargets: ItemRate[]) => void;
}

export function TargetsChooser(props: TargetsChooserProps) {
  const numTargets = props.targets.length;

  return (
    <div>
      <h3>Production Targets</h3>
      <div css={listStyles}>
        {props.targets.map((_target, index) => (
          <_Target key={index} {...props} index={index} />
        ))}
        <_Target key={numTargets} {...props} index={numTargets} />
      </div>
    </div>
  );
}

interface _TargetProps extends TargetsChooserProps {
  index: number;
}

function _Target({ targets, setTargets, index }: _TargetProps) {
  const { slug, perMinute } = targets[index] || {};

  const isExisting = index < targets.length;

  return (
    <div css={targetStyles}>
      <EntityChooser
        placeholder='Add New Target…'
        kind={EntityKind.Item}
        slug={slug}
        setSlug={newSlug => {
          const newTargets = [...targets];
          newTargets[index] = { ...targets[index], slug: newSlug };
          setTargets(newTargets);
        }}
      />
      {isExisting && (
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
      )}
      {isExisting && (
        <div
          css={cancelStyles}
          onClick={() => {
            console.log(
              'removing target:',
              index,
              targets.filter((_t, i) => i === index),
            );
            setTargets(targets.filter((_t, i) => i !== index));
          }}>
          <CancelIcon css={cancelIconStyles} />
        </div>
      )}
    </div>
  );
}
