import { css } from '@emotion/core';

import { Section } from '~/components/Section';
import { sizing, colors } from '~/style';
import { useRecipes, useEntities } from '~/data';

import { solveFor } from './solve';
import { useMemo, useState } from 'react';

const rootStyles = css({
  padding: sizing.sectionPadding,
});

const taglineStyles = css({
  fontSize: sizing.FontSize.Small,
  color: colors.Dark.N500,
});

export function SolverPage() {
  const recipes = useRecipes();
  const entities = useEntities();
  const [targets] = useState([{ slug: 'plastic', perMinute: 90 }]);
  const result = useMemo(
    () =>
      solveFor(recipes, entities, {
        targets,
        optimizeResiduals: true,
        includeAlternateRecipes: true,
      }),
    [recipes, entities, targets],
  );
  if (!result) return null;

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
