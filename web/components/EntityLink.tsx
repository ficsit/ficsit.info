import { AnyEntity } from '@local/schema';
import { NavLink } from 'react-router-dom';
import { css, SerializedStyles } from '@emotion/core';

import { entityUrl } from '~/routing';
import { colors } from '~/style';

import { EntityImage } from './EntityImage';

export class Foo extends React.Component<{ asdf: number }> {}

const rootStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    color: colors.Primary.N500,
    picture: {
      filter: `
        drop-shadow( 1px 0   1px ${colors.Primary.N500})
        drop-shadow(-1px 0   1px ${colors.Primary.N500})
        drop-shadow( 0   1px 1px ${colors.Primary.N500})
        drop-shadow( 0  -1px 1px ${colors.Primary.N500})
      `,
    },
  },
});

const imageStyles = css({
  verticalAlign: 'middle',
  marginRight: '0.25em',
});

export interface EntityLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  entity: AnyEntity;
  imageCss?: SerializedStyles;
  size?: number;
}

export function EntityLink({ entity, imageCss, size = 24, ...props }: EntityLinkProps) {
  const inlineStyle = {
    marginTop: size / -2,
    marginBottom: size / -2,
  };

  return (
    <NavLink {...props} to={entityUrl(entity)} css={rootStyles}>
      <EntityImage entity={entity} size={size} css={[imageStyles, imageCss, inlineStyle]} />
      {entity.name}
    </NavLink>
  );
}
