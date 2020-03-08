import { css } from '@emotion/core';

import { Section } from '~/components/Section';
import { sizing, colors } from '~/style';
import { useRecipes, useEntities } from '~/data';

import { solveFor, SolverResult } from './solve';
import { useMemo, useState } from 'react';
import { RecipeResults } from './RecipeResults';
import { TargetsChooser } from './TargetsChooser';

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
  const [targets, setTargets] = useState([]);
  const result = useMemo(() => {
    try {
      return solveFor(recipes, entities, {
        targets,
        optimizeResiduals: true,
        includeAlternateRecipes: true,
      });
    } catch (error) {
      console.error(`solver error:`, error);
      return { error };
    }
  }, [recipes, entities, targets]);

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
        <TargetsChooser targets={targets} setTargets={setTargets} />
      </Section>
      {_renderResult(result)}
    </article>
  );
}

function _renderResult(result?: SolverResult | { error: any }) {
  if (!result) return null;

  if ('error' in result) {
    const { error } = result;
    return (
      <Section title='Whoopsie'>
        <p>Something went wrong when embettening your production line:</p>
        <p>{error.message || error}</p>
      </Section>
    );
  } else {
    return (
      <Section title='Optimized Recipe Use'>
        <RecipeResults result={result} />
      </Section>
    );
  }
}
