import { EntityKind } from '@local/schema';
import { css } from '@emotion/core';

import { sizing, colors } from '~/style';

import { EntityList } from './EntityList';
import { useState } from 'react';
import { EntityListItem } from './EntityListItem';
import { useEntity } from '~/data';

const rowHeight = 30;

const rootStyles = css({
  position: 'relative',
  width: sizing.sidebarWidth,
  height: rowHeight,
  '&:hover': {
    zIndex: 10,
  },
});

const entityListStyles = css({
  position: 'absolute',
  borderRadius: 4,
  top: 0,
  left: 0,
  height: rowHeight * 8,
  width: '100%',
  backgroundColor: colors.Light.N100,
  zIndex: 1000,
  boxShadow: `0 0 4px 2px rgba(0, 0, 0, 0.25)`,
  '> input': {
    height: rowHeight,
  },
});

const selectedEntityStyles = css({
  display: 'flex',
  alignItems: 'center',
  height: rowHeight,
  border: `2px solid ${colors.Light.N400}`,
  backgroundColor: colors.Light.N100,
  borderRadius: 4,
  '&:hover': {
    border: `2px solid ${colors.Primary.N500}`,
  },
  span: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

const placeholderStyles = css({
  cursor: 'pointer',
  padding: `0 ${sizing.Padding.Medium}px`,
});

export interface EntityChooserProps {
  kind: EntityKind;
  slug?: string;
  setSlug: (newSlug: string) => void;
  placeholder?: string;
}

export function EntityChooser({
  kind,
  slug,
  setSlug,
  placeholder,
  ...props
}: EntityChooserProps) {
  const [editing, setEditing] = useState(false);
  const entity = useEntity(slug);

  const ref = React.createRef<HTMLDivElement>();

  if (editing) {
    return (
      <div
        ref={ref}
        css={rootStyles}
        onBlur={() => setEditing(false)}
        {...props}>
        <EntityList
          autoFocus
          kind={kind}
          rowHeight={rowHeight}
          css={entityListStyles}
          className='entityList'
          selected={slug}
          onChange={(newSlug: string) => {
            setEditing(false);
            setSlug(newSlug);
          }}
        />
      </div>
    );
  } else if (entity) {
    return (
      <div css={rootStyles} {...props}>
        <EntityListItem
          css={selectedEntityStyles}
          className={'chosen'}
          entity={entity}
          onTap={() => setEditing(true)}
          height={rowHeight}
        />
      </div>
    );
  } else {
    return (
      <div css={rootStyles} {...props}>
        <div
          css={[selectedEntityStyles, placeholderStyles]}
          className={'placeholder'}
          onPointerUp={() => setEditing(true)}>
          {placeholder}
        </div>
      </div>
    );
  }
}
