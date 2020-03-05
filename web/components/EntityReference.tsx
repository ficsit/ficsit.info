import { NavLink } from 'react-router-dom';
import { css } from '@emotion/core';

import { useEntity, useItem } from '~/data';
import { entityUrl } from '~/routing';
import { colors, sizing } from '~/style';

import { EntityImage } from './EntityImage';
import { ItemForm, EntityKind } from '@local/schema';

const padding = sizing.Padding.Small;

const rootStyles = css({
  display: 'inline-block',
  position: 'relative',
  boxSizing: 'content-box',
  
  padding: padding,
  margin: padding,
  backgroundColor: colors.Light.N100,
  '&.active, &.active:hover': {
    backgroundColor: 'transparent',
    cursor: 'default',
  },
  '&:hover': {
    backgroundColor: colors.Primary.N500,
    'picture': {
      filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.85))',
    },
  },
});


const shapeStyles = {
  default: css({
    backgroundColor: 'transparent',
    borderRadius: 4,
    boxShadow: '0 0 4px rgba(0,0,0,0.35) inset',
  }),
  item: css({
    borderRadius: 4,
  }),
  liquid: css({
    borderRadius: 100,
  }),
};

const badgeStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  bottom: -padding,
  right: -padding,
  minWidth: 20,
  minHeight: 20,
  zIndex: 10,
  fontSize: 12,
  lineHeight: 1.0,  
  color: colors.Light.N50,
  backgroundColor: colors.Dark.N500,
  borderRadius: 100,
  border: `2px solid ${colors.Light.N0}`,
});

export interface EntityReferenceProps {
  slug: string;
  badge?: string | number;
  size?: number;
}

export function EntityReference({ slug, badge, size = 32 }: EntityReferenceProps) {
  const entity = useEntity(slug);
  // TODO: make liquids their own entity type.
  const item = useItem(slug);
  if (!entity) return <div css={rootStyles} />;

  let shape: keyof typeof shapeStyles = 'default';
  if (item?.form === ItemForm.Liquid) {
    shape = 'liquid';
  } else if (entity.kind === EntityKind.Item) {
    shape = 'item';
  }

  const style = { height: size, width: size };

  return (
    <NavLink to={entityUrl(entity)} css={[rootStyles, shapeStyles[shape]]} style={style}>
      <EntityImage entity={entity} size={size} />
      {!!badge && <div css={badgeStyles}>{badge}</div>}
    </NavLink>
  )
}
