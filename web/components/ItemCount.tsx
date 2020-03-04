import { NavLink } from 'react-router-dom';
import { ItemForm } from '@local/schema';
import { css, SerializedStyles } from '@emotion/core';

import { useItem } from '~/data';
import { entityUrl } from '~/routing';
import { colors, sizing } from '~/style';

import { EntityImage } from './EntityImage';

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

const itemFormStyles = {
  [ItemForm.Solid]: css({
    borderRadius: 3,
  }),
  [ItemForm.Liquid]: css({
    borderRadius: size,
  }),
} as Record<ItemForm, SerializedStyles>;

const countStyles = css({
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

export interface ItemCountProps {
  slug: string;
  count: number;
}

export function ItemCount({ slug, count }: ItemCountProps) {
  const item = useItem(slug);;
  if (!item) return <div css={rootStyles} />;

  if (item.form === ItemForm.Liquid) {
    count = count / 1000;
  }

  return (
    <NavLink to={entityUrl(item)} css={[rootStyles, itemFormStyles[item.form]]}>
      <EntityImage entity={item} size={size} />
      <div css={countStyles}>{count}</div>
    </NavLink>
  )
}
