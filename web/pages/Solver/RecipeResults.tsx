import { css } from '@emotion/core';
import { Recipe } from '@local/schema';

import { useRecipes, useBuilding } from '~/data';
import { RecipeTable } from '~/components/RecipeTable';
import { EntityReference } from '~/components/EntityReference';
import { sizing, colors } from '~/style';

import { SolverResult } from './solve';
import { Value, ValueUnit } from '~/components/Value';

const itemHeight = sizing.navListIconSize + sizing.Padding.Small * 2;

const multipleStyles = css({
  display: 'inline-block',
  minWidth:
    sizing.navListIconSize + sizing.Padding.Normal + sizing.Padding.Small * 2,
  textAlign: 'right',
  paddingRight: sizing.Padding.Normal,
  color: colors.Dark.N500,
});

const beforeStyles = css({
  display: 'flex',
});

const powerUsageStyles = css({
  display: 'flex',
  alignItems: 'center',
  padding: `0 ${sizing.Padding.Medium}px`,
  height: itemHeight,
});

const beforeCountStyles = css({
  color: colors.Dark.N500,
  fontSize: sizing.FontSize.Small,
  textAlign: 'center',
});

const beforeDividerStyles = css({
  display: 'flex',
  gridColumn: 'arrow',
  alignItems: 'center',
  textAlign: 'center',
  fontSize: 32,
  height: itemHeight,
  fontWeight: 'bold',
  minWidth: sizing.Padding.Normal,
  color: colors.Light.N400,
});

export interface RecipeResultsProps {
  result: SolverResult;
}

export function RecipeResults({ result }: RecipeResultsProps) {
  const recipes = useRecipes();
  if (!recipes) return null;

  const recipesToList = result.recipes.map(({ slug }) => recipes[slug]);
  const multiples = new Map(
    result.recipes.map(({ slug, multiple }) => [slug, multiple] as const),
  );

  return (
    <div>
      <RecipeTable
        recipes={recipesToList}
        renderTitle={({ slug, name }) => (
          <React.Fragment>
            <span css={multipleStyles}>{multiples.get(slug)?.toFixed(2)}x</span>
            {name}
          </React.Fragment>
        )}
        showRates={({ slug }) => multiples.get(slug)!}
        size={sizing.navListIconSize}
        renderBefore={recipe => (
          <_Before recipe={recipe} multiple={multiples.get(recipe.slug)!} />
        )}
      />
    </div>
  );
}

interface _BeforeProps {
  recipe: Recipe;
  multiple: number;
}

function _Before({ recipe, multiple }: _BeforeProps) {
  const building = useBuilding(recipe.producedIn[0]);
  if (!building) return null;

  const count = Math.ceil(multiple);
  const clockSpeed = multiple / count;
  const { amount, exponent } = building.powerConsumption!;
  const powerUsage = count * amount * Math.pow(clockSpeed, exponent);

  return (
    <div css={beforeStyles}>
      <div>
        <EntityReference slug={building.slug} size={sizing.navListIconSize} />
        <div css={beforeCountStyles}>
          {count} @ {Math.ceil(clockSpeed * 100)}%
        </div>
      </div>
      <div css={powerUsageStyles}>
        <Value unit={ValueUnit.Megawatts} value={powerUsage} showIcon />
      </div>
      <div css={beforeDividerStyles}>:</div>
    </div>
  );
}
