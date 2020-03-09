import { css } from '@emotion/core';

import { Section } from '~/components/Section';
import { sizing, colors } from '~/style';
import { useRecipes, useEntities } from '~/data';

import { solveFor, SolverResult, ItemRate, SolverOptions } from './solve';
import { useMemo, useState } from 'react';
import { RecipeResults } from './RecipeResults';
import { TargetsChooser } from './TargetsChooser';
import { OptionsChooser } from './OptionsChooser';
import { SolverSummary } from './SolverSummary';

const rootStyles = css({
  padding: sizing.sectionPadding,
});

const chooserStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridGap: sizing.Padding.Normal,
  [`@media(max-width: ${sizing.minContentWidth}px)`]: {
    gridTemplateColumns: 'repeat(1, 1fr)',
  },
});

const taglineStyles = css({
  fontSize: sizing.FontSize.Small,
  color: colors.Dark.N500,
});

export function SolverPage() {
  const recipes = useRecipes();
  const entities = useEntities();
  const [targets, setTargets] = useState<ItemRate[]>([
    { slug: 'plastic', perMinute: 30 },
  ]);
  const [options, setOptions] = useState<SolverOptions>({
    optimizeResiduals: true,
    includeAlternateRecipes: true,
  });
  const result = useMemo(() => {
    try {
      return solveFor(recipes, entities, { ...options, targets });
    } catch (error) {
      console.error(`solver error:`, error);
      return { error };
    }
  }, [recipes, entities, options, targets]);

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
        <div css={chooserStyles}>
          <TargetsChooser targets={targets} setTargets={setTargets} />
          <OptionsChooser options={options} setOptions={setOptions} />
        </div>
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
      <div>
        <Section title='Summary'>
          <SolverSummary result={result} />
        </Section>
        <Section title='Optimized Recipe Use'>
          <RecipeResults result={result} />
        </Section>
      </div>
    );
  }
}
