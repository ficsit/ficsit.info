import { css } from '@emotion/core';

import { Section } from '~/components/Section';
import { sizing, colors } from '~/style';
import { useRecipes, useEntities } from '~/data';

import { solveFor } from './solve';
import { useMemo, useState } from 'react';
import { RecipeResults } from './RecipeResults';

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
          <h3>Production Targets</h3>…
        </div>
      </Section>
      {!!result && (
        <React.Fragment>
          <Section title='Optimized Recipe Use'>
            <RecipeResults result={result} />
          </Section>
          <Section title='Data'>
            <pre style={{ fontSize: 10 }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </Section>
        </React.Fragment>
      )}
    </article>
  );
}
