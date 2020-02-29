import { Indexable, EntityKind } from '@local/schema';
import { NavLink } from 'react-router-dom';
import { css, SerializedStyles } from '@emotion/core';

import { EntityImage } from './EntityImage';

export class Foo extends React.Component<{ asdf: number }> {
}

const rootStyles = css({
  display: 'inline-block',
});

const imageStyles = css({
  verticalAlign: 'middle',
  marginRight: '0.25em',
});

export interface EntityLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  entity: Indexable;
  imageCss?: SerializedStyles;
  size?: number;
}

export function EntityLink({ entity, imageCss, size = 24, ...props }: EntityLinkProps) {
  const inlineStyle = {
    marginTop: size / -2,
    marginBottom: size / -2,
  };

  return (
    <NavLink {...props} to={_entityUrl(entity)} css={rootStyles}>
      <EntityImage entity={entity} size={size} css={[imageStyles, imageCss, inlineStyle]} />
      {entity.name}
    </NavLink>
  );
}

function _entityUrl(entity: Indexable) {
  switch (entity.kind) {
    case EntityKind.Building: return `/buildings/${entity.slug}`;
    case EntityKind.Item: return `/items/${entity.slug}`;
    case EntityKind.Recipe: return `/recipes/${entity.slug}`;
    case EntityKind.Schematic: return `/research/${entity.slug}`;
  }
}
