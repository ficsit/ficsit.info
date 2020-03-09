import { NavLink } from 'react-router-dom';
import { AnyEntity } from '@local/schema';
import { css } from '@emotion/core';

import { entityUrl } from '~/routing';
import { colors } from '~/style';

import { HighlightedText } from './HighlightedText';
import { EntityImage } from './EntityImage';

const iconScale = 0.8;

const rootStyles = css({
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  padding: `0 8px`,
  color: 'inherit',
  textDecoration: 'none',
  picture: {
    marginRight: 8,
  },
  ':hover, &.active, &.focused': {
    color: colors.Light.N0,
    picture: {
      filter: `
        drop-shadow( 1px 0   1px ${colors.Light.N0})
        drop-shadow(-1px 0   1px ${colors.Light.N0})
        drop-shadow( 0   1px 1px ${colors.Light.N0})
        drop-shadow( 0  -1px 1px ${colors.Light.N0})
      `,
    },
  },
  ':hover, &.focused': {
    backgroundColor: `${colors.Primary.N500}aa`,
  },
  '&.active': {
    backgroundColor: colors.Primary.N500,
  },
});

export interface EntityListItemProps {
  entity: AnyEntity;
  onTap: () => void;
  active?: boolean;
  focused?: boolean;
  filter?: string;
  height?: 30 | 40 | 60;
  style?: React.CSSProperties;
  className?: string;
}

export function EntityListItem({
  entity,
  filter,
  onTap,
  active,
  focused,
  className,
  height = 60,
  ...props
}: EntityListItemProps) {
  if (active) {
    className = [className, 'active'].join(' ');
  }
  if (focused) {
    className = [className, 'focused'].join(' ');
  }

  return (
    <NavLink
      {...props}
      className={className}
      css={rootStyles}
      to={entityUrl(entity)}
      onPointerDown={(event: any) => {
        event.preventDefault();
      }}
      onPointerUp={(event: any) => {
        // Let cmd/ctrl clicks work naturally.
        if (event.metaKey || event.ctrlKey) return;
        event.preventDefault();
        onTap();
      }}>
      <EntityImage entity={entity} size={height * iconScale} />
      <HighlightedText text={entity.name} search={filter} />
    </NavLink>
  );
}
