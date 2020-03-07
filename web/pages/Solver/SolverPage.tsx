import { css } from '@emotion/core';

import { Section } from '~/components/Section';
import { sizing, colors } from '~/style';
import { useRecipes, useEntitiesByKind } from '~/data';

import { solveFor } from './solve';
import { useMemo, useState } from 'react';
import { EntityKind, Recipe, Item } from '@local/schema';

const rootStyles = css({
  padding: sizing.sectionPadding,
});

const taglineStyles = css({
  fontSize: sizing.FontSize.Small,
  color: colors.Dark.N500,
});

export function SolverPage() {
  const allRecipes = useRecipes();
  const items = useEntitiesByKind(EntityKind.Item);

  const recipes = useMemo(() => _productionRecipes(allRecipes), [allRecipes]);
  const resources = useMemo(() => _resources(items), [items]);

  const [targets] = useState([{ slug: 'plastic', perMinute: 90 }]);

  const result = useMemo(
    () => solveFor(recipes, resources, targets, { optimizeResiduals: true }),
    [recipes, resources, targets],
  );
  if (!allRecipes) return null;

  return (
    <article css={rootStyles}>
      <Section
        title={
          <span>
            <h1>Embetterer™</h1>
            <span css={taglineStyles}>
              The Embetterer™ makes your production line better by optimizing
              the crap out of it!
            </span>
          </span>
        }>
        <div>
          <h3>Production Targets</h3>
        </div>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </Section>
    </article>
  );
}

function _productionRecipes(recipes?: Record<string, Recipe>) {
  if (!recipes) return;
  return Object.values(recipes).filter(r => r.producedIn.length);
}

function _resources(items?: Record<string, Item>) {
  if (!items) return;
  return Object.values(items).filter(i => i.raw);
}
