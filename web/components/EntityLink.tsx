import { Indexable, EntityKind } from '@local/schema';
import { NavLink } from 'react-router-dom';
import { css } from '@emotion/core';

import { EntityImage } from './Image';

export class Foo extends React.Component<{ asdf: number }> {
}

const rootStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'none',
  backgroundColor: '#eeeeee',
  border: '1px solid #999999',
  borderRadius: 3,
  margin: 2,
  ':hover': {
    backgroundColor: '#dddddd',
  },
  '&.active': {
    backgroundColor: '#ffffff',
  },
});

const imageContainerStyles = css({
  margin: 8,
  borderRadius: 3,
  backgroundColor: '#ffffff',
  padding: 2,
});

const imageStyles = css({
  verticalAlign: 'top',
});

export interface EntityLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  entity: Indexable
}

export function EntityLink({ entity, ...props }: EntityLinkProps) {
  return (
    <NavLink {...props} to={_entityUrl(entity)} css={rootStyles}>
      <div css={imageContainerStyles}>
        <EntityImage entity={entity} width={32} css={imageStyles} />
      </div>
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
