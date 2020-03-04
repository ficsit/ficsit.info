import { NavLink } from 'react-router-dom';
import { css } from '@emotion/core';

import { useEntity, useItem } from '~/data';
import { entityUrl } from '~/routing';
import { colors, sizing } from '~/style';

import { EntityImage } from './EntityImage';
import { ItemForm } from '@local/schema';

const size = 32;
const padding = sizing.Padding.Small;

const rootStyles = css({
  display: 'inline-block',
  position: 'relative',
  height: size + padding * 2,
  width: size + padding * 2,
  padding: padding,
  margin: padding,
  backgroundColor: colors.Light.N100,
  '&:hover': {
    backgroundColor: colors.Primary.N500,
    'picture': {
      filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.85))',
    },
  },
});

const shapeStyles = {
  square: css({
    borderRadius: 3,
  }),
  round: css({
    borderRadius: size,
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
  borderRadius: size,
  border: `2px solid ${colors.Light.N0}`,
});

export interface EntityReferenceProps {
  slug: string;
  badge?: string | number;
}

export function EntityReference({ slug, badge }: EntityReferenceProps) {
  const entity = useEntity(slug);
  // TODO: make liquids their own entity type.
  const item = useItem(slug);
  if (!entity) return <div css={rootStyles} />;

  const shape = item?.form === ItemForm.Liquid ? 'round' : 'square';

  return (
    <NavLink to={entityUrl(entity)} css={[rootStyles, shapeStyles[shape]]}>
      <EntityImage entity={entity} size={size} />
      {!!badge && <div css={badgeStyles}>{badge}</div>}
    </NavLink>
  )
}
