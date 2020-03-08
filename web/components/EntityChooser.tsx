import { EntityKind } from '@local/schema';
import { css } from '@emotion/core';

import { sizing } from '~/style';

import { EntityList } from './EntityList';

const rootStyles = css({
  display: 'inline-block',
  height: 200,
  width: sizing.sidebarWidth,
});

const entityListStyles = css({
  height: '100%',
});

export interface EntityChooserProps {
  kind: EntityKind;
  slug?: string;
  setSlug: (newSlug: string) => void;
}

export function EntityChooser({ kind, slug, setSlug }: EntityChooserProps) {
  return (
    <div css={rootStyles}>
      {slug}
      <EntityList
        kind={kind}
        rowHeight={40}
        css={entityListStyles}
        selected={slug}
        onChange={setSlug}
      />
    </div>
  );
}
