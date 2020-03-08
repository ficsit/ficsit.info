import { css } from '@emotion/core';
import { Recipe, Item, Building } from '@local/schema';

import { useRecipes, useBuilding, useEntities } from '~/data';
import {
  RecipeTable,
  Extraction,
  ExtractionDetails,
  isExtraction,
} from '~/components/RecipeTable';
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
  const entities = useEntities();
  if (!recipes || !entities) return null;

  const recipesToList = result.recipes.map(({ slug }) => recipes[slug]);
  const multiples = new Map(
    result.recipes.map(({ slug, multiple }) => [slug, multiple] as const),
  );

  const extractions = [] as Extraction[];
  for (const { slug, perMinute } of result.inputs) {
    const item = entities[slug] as Item;
    const buildingSlug = item.resource?.extractedBy?.[0]!;
    const building = entities[buildingSlug] as Building;

    extractions.push({ building: buildingSlug, item: slug });

    const { cycleTime, itemsPerCycle } = building.extraction!;
    const perBuilding = (60 / cycleTime) * itemsPerCycle;
    multiples.set(buildingSlug, perMinute / perBuilding);
  }

  return (
    <div>
      <RecipeTable
        extractions={extractions}
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
  recipe: Recipe | ExtractionDetails;
  multiple: number;
}

function _Before({ recipe, multiple }: _BeforeProps) {
  const building = useBuilding(
    isExtraction(recipe) ? recipe.slug : recipe.producedIn[0],
  );
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
