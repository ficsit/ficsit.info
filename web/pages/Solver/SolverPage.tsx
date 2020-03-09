import { css } from '@emotion/core';

import { Section } from '~/components/Section';
import { sizing, colors } from '~/style';
import { useRecipes, useEntities } from '~/data';

import {
  solveFor,
  SolverResult,
  ItemRate,
  SolverOptions,
  SolverConfiguration,
} from './solve';
import { useMemo, useState } from 'react';
import { RecipeResults } from './RecipeResults';
import { TargetsChooser } from './TargetsChooser';
import { OptionsChooser } from './OptionsChooser';
import { SolverSummary } from './SolverSummary';
import { useLocation, useNavigate } from 'react-router';
import { encodeConfig, decodeConfig } from './url';

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
  const navigate = useNavigate();
  const location = useLocation();
  const config = useMemo(() => decodeConfig(location.search), [location]);
  const setConfig = (newConfig: SolverConfiguration) => {
    navigate(`.${encodeConfig(newConfig)}`);
  };

  const recipes = useRecipes();
  const entities = useEntities();

  const result = useMemo(() => {
    try {
      return solveFor(recipes, entities, config);
    } catch (error) {
      console.error(`solver error:`, error);
      return { error };
    }
  }, [recipes, entities, config]);

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
          <TargetsChooser
            targets={config.targets}
            setTargets={newTargets => {
              setConfig({ ...config, targets: newTargets });
            }}
          />
          <OptionsChooser
            options={config}
            setOptions={newOptions => {
              setConfig({ ...config, ...newOptions });
            }}
          />
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
