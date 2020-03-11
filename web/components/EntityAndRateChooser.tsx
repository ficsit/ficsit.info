import { css } from '@emotion/core';
import { EntityKind } from '@local/schema';

import { ItemRate } from '~/pages/Solver/solve';
import { colors, sizing } from '~/style';

import { EntityChooser } from './EntityChooser';

import CancelIcon from '~/assets/images/cancel.svg';

const chooserWidth = 250;
const rateWidth = 40;
const unitWidth = 35;

const rootStyles = css({
  display: 'flex',
});

const chooserStyles = css({
  width: chooserWidth,
  '.entityList': {
    width: chooserWidth + rateWidth - 2,
  },
});

const inputContainerStyles = css({
  position: 'relative',
  alignItems: 'center',
  overflow: 'hidden',
  fontSize: sizing.FontSize.Small,
  width: rateWidth,
  border: `2px solid ${colors.Light.N400}`,
  borderTopRightRadius: 4,
  borderBottomRightRadius: 4,
  marginLeft: -2,
  backgroundColor: colors.Light.N100,
  '&:hover': {
    border: `2px solid ${colors.Primary.N500}`,
    zIndex: 10,
    marginRight: -unitWidth,
    width: rateWidth + unitWidth,
    paddingRight: unitWidth,
  },
});

const inputStyles = css({
  position: 'relative',
  border: 'none',
  outline: 'none',
  textAlign: 'right',
  height: '100%',
  width: '100%',
  backgroundColor: 'transparent',
  zIndex: 1,
});

const unitLabelStyles = css({
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: rateWidth,
  zIndex: 5,
  width: unitWidth,
  color: colors.Dark.N500,
});

const clearStyles = css({
  display: 'flex',
  padding: 7,
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

interface EntityAndRateChooserProps {
  target?: ItemRate;
  setTarget: (newTarget?: ItemRate) => void;
  hideRate?: boolean;
}

export function EntityAndRateChooser({ target, setTarget, hideRate, ...props }: EntityAndRateChooserProps) {
  const { slug, perMinute } = target || {};

  return (
    <div css={rootStyles} {...props}>
      <EntityChooser
        css={chooserStyles}
        placeholder='Add New Target…'
        kind={EntityKind.Item}
        slug={slug}
        setSlug={newSlug => {
          setTarget({ perMinute: 10, ...target, slug: newSlug });
        }}
      />
      {target && (
        <div css={inputContainerStyles} style={{ visibility: hideRate ? 'hidden' : undefined }}>
          <input
            css={inputStyles}
            value={perMinute}
            type='text'
            pattern='\d*'
            onChange={event => {
              setTarget({
                ...target,
                perMinute: parseInt(event.target.value, 10) || 0,
              });
            }}
            onKeyDown={event => {
              const current = target.perMinute;
              let perMinute: number | undefined;
              if (event.key === 'ArrowUp') {
                perMinute = current + 1;
              } else if (event.key === 'ArrowDown') {
                perMinute = current - 1;
              }
              if (perMinute === undefined) return;

              event.preventDefault();
              setTarget({ ...target, perMinute });
            }}
          />
          <div css={unitLabelStyles}> / min</div>
        </div>
      )}
      {target && (
        <div
          css={clearStyles}
          onPointerUp={() => {
            setTarget(undefined);
          }}
        >
          <CancelIcon />
        </div>
      )}
    </div>
  );
}
