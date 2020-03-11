import { css } from '@emotion/core';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { Section } from '~/components/Section';
import { useRecipes, useEntities } from '~/data';
import { sizing, colors } from '~/style';

import { ConstraintsChooser } from './ConstraintsChooser';
import { OptionsChooser } from './OptionsChooser';
import { RecipeResults } from './RecipeResults';
import { SolverSummary } from './SolverSummary';
import { TargetsChooser } from './TargetsChooser';
import { solveFor, SolverResult, SolverConfiguration } from './solve';
import { encodeConfig, decodeConfig } from './url';

const rootStyles = css({
  padding: sizing.sectionPadding,
});

const chooserStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridGap: sizing.Padding.Normal,
  [`@media(max-width: ${sizing.minContentWidth * 1.5}px)`]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [`@media(max-width: ${sizing.minContentWidth}px)`]: {
    gridTemplateColumns: 'repeat(1, 1fr)',
  },
});

const taglineStyles = css({
  fontSize: sizing.FontSize.Small,
  color: colors.Dark.N500,
});

const errorStyles = css({
  color: colors.Semantic.Error,
  p: {
    '&:first-of-type': {
      marginTop: 0,
    },
    '&:last-of-type': {
      marginBottom: 0,
    },
  },
});

const errorMessageStyles = css({
  margin: sizing.Padding.Normal,
  fontWeight: 'bold',
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
        allowOverflow
        title={
          <span>
            <h1>Embetterer™</h1>
            <span css={taglineStyles}>
              The Embetterer™ makes your production line better by optimizing the crap out of it!
            </span>
          </span>
        }
      >
        <div css={chooserStyles}>
          <TargetsChooser
            targets={config.targets}
            setTargets={newTargets => {
              setConfig({ ...config, targets: newTargets });
            }}
          />
          <ConstraintsChooser
            constraints={config.constraints}
            setConstraints={newConstraints => {
              setConfig({ ...config, constraints: newConstraints });
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
      <Section title='Whoopsie' css={errorStyles}>
        <p>Something went wrong when embettening™ your production line!</p>
        <p css={errorMessageStyles}>{error.message || error}</p>
        <p>
          …look—this is FICSIT—if we had a checklist for every problem, you probably wouldn't have a job. Try
          pressing some buttons until it works.
        </p>
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
