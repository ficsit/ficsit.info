import { EntityKind } from '@local/schema';

import { EntityChooser } from '~/components/EntityChooser';
import { useState } from 'react';

export interface TargetsChooserProps {}

export function TargetsChooser({}: TargetsChooserProps) {
  return (
    <div>
      <h3>Production Targets</h3>
      <_Target />
    </div>
  );
}

function _Target() {
  const [slug, setSlug] = useState<string>();

  return <EntityChooser kind={EntityKind.Item} slug={slug} setSlug={setSlug} />;
}
