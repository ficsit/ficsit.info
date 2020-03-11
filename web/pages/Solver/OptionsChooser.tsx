import { css } from '@emotion/core';

import { sizing } from '~/style';

import { SolverOptions } from './solve';

const rootStyles = css({
  label: {
    display: 'flex',
    alignItems: 'center',
    padding: `${sizing.Padding.Medium}px 0`,
    userSelect: 'none',
    cursor: 'pointer',
    'input[type=checkbox]': {
      marginRight: '0.25em',
    },
  },
});

export interface OptionsChooserProps {
  options?: SolverOptions;
  setOptions: (newOptions: SolverOptions) => void;
}

export function OptionsChooser({ options, setOptions }: OptionsChooserProps) {
  if (!options) return null;

  return (
    <div css={rootStyles}>
      <h3>Options</h3>
      {_renderOption(options, setOptions, 'includeAlternateRecipes', `Include Alternative Recipes`)}
      {_renderOption(options, setOptions, 'optimizeResiduals', `Minimize Residual Outputs`)}
    </div>
  );
}

function _renderOption(
  options: SolverOptions,
  setOptions: (newOptions: SolverOptions) => void,
  key: keyof SolverOptions,
  label: React.ReactNode,
) {
  return (
    <label>
      <input
        type='checkbox'
        checked={!!options[key]}
        onChange={({ target }) =>
          setOptions({
            ...options,
            [key]: target.checked,
          })
        }
      />
      {label}
    </label>
  );
}
