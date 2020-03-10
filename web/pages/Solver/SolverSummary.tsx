import {
  AnyEntity,
  EntityKind,
  ItemForm,
  PoweredBuilding,
  Recipe,
} from '@local/schema';
import { css } from '@emotion/core';

import { EntityLink } from '~/components/EntityLink';
import { useEntities, useRecipes } from '~/data';
import { Rate } from '~/components/Rate';
import { sizing, colors } from '~/style';
import { groupPowerConsumption } from '~/calc/power';
import { Value, ValueUnit } from '~/components/Value';

import { SolverResult, ItemRate } from './solve';
import { extractionsFromInputs } from './helpers';

const rootStyles = css({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))`,
  gridGap: sizing.Padding.Normal,
  h3: {
    paddingBottom: sizing.Padding.Small,
    borderBottom: `1px solid ${colors.Light.N100}`,
    marginBottom: sizing.Padding.Small,
  },
});

const tableStyles = css({
  display: 'grid',
  gridTemplateColumns: `[rate] auto [entity] 1fr`,
  gridGap: sizing.Padding.Medium,
  alignItems: 'center',
});

const rateStyles = css({
  gridColumn: 'rate',
  justifyContent: 'flex-end',
  '> div': {
    textAlign: 'right',
  },
});

const entityStyles = css({
  gridColumn: 'entity',
});

const buildingContainerStyles = css({
  display: 'grid',
  gridTemplateColumns: `
    [count] min-content [building] max-content [rate] 1fr
  `,
  gridTemplateRows: 'repeat(1, 1fr)',
  alignItems: 'center',
  gridGap: sizing.Padding.Medium,
});

const buildingCountStyles = css({
  gridColumn: 'count',
});

const buildingRateStyles = css({
  gridColumn: 'rate',
  justifyContent: 'flex-start',
});

const buildingStyles = css({
  gridColumn: 'building',
});

const buildingTotalStyles = css({
  gridColumn: 'building',
  paddingLeft: 28,
});

const lastRowStyles = css({
  paddingTop: sizing.Padding.Medium,
  fontWeight: 'bold',
});

export interface SolverSummaryProps {
  result: SolverResult;
}

export function SolverSummary({ result }: SolverSummaryProps) {
  const entities = useEntities();
  if (!entities) return null;

  return (
    <div css={rootStyles}>
      <div>
        <h3>Inputs</h3>
        <_RateTable rates={result.inputs} entities={entities} />
      </div>
      <div>
        <h3>Outputs</h3>
        <_RateTable rates={result.outputs} entities={entities} />
      </div>
      {!!result.residuals.length && (
        <div>
          <h3>Residuals</h3>
          <_RateTable rates={result.residuals} entities={entities} />
        </div>
      )}
      <div>
        <h3>Buildings</h3>
        <_Buildings result={result} entities={entities} />
      </div>
    </div>
  );
}

interface _RateTableProps {
  rates: ItemRate[];
  entities: Record<string, AnyEntity>;
}

function _RateTable({ rates, entities }: _RateTableProps) {
  return (
    <div css={tableStyles}>
      {rates.map(({ slug, perMinute }) => (
        <React.Fragment key={slug}>
          <Rate
            css={rateStyles}
            rate={perMinute}
            isLiquid={isLiquid(entities[slug])}
          />
          <EntityLink css={entityStyles} entity={entities[slug]} />
        </React.Fragment>
      ))}
    </div>
  );
}

function isLiquid(entity: AnyEntity) {
  if (entity.kind !== EntityKind.Item) return false;
  return entity.form === ItemForm.Liquid;
}

interface _BuildingsProps {
  entities: Record<string, AnyEntity>;
  result: SolverResult;
}
function _Buildings({
  entities,
  result: { recipes, inputs },
}: _BuildingsProps) {
  const allRecipes = useRecipes();
  if (!allRecipes || !entities) return null;

  const results = Object.create(null) as BuildingResults;
  results['__total__'] = { power: 0, count: 0 };
  _collectExtractionsFromInputs(results, entities, inputs);
  _collectBuildingsFromRecipes(results, allRecipes, entities, recipes);

  return (
    <div css={buildingContainerStyles}>
      {Object.entries(results)
        .filter(([k]) => k !== '__total__')
        .map(([slug, { power, count }]) => (
          <React.Fragment key={slug}>
            <div css={buildingCountStyles}>{count}x</div>
            <EntityLink css={buildingStyles} entity={entities[slug]} />
            <Value
              css={buildingRateStyles}
              unit={ValueUnit.Megawatts}
              value={power}
              showIcon
            />
          </React.Fragment>
        ))}

      <div css={[buildingCountStyles, lastRowStyles]}>
        {results['__total__'].count}x
      </div>
      <div css={[buildingTotalStyles, lastRowStyles]}>Total</div>
      <Value
        css={[buildingRateStyles, lastRowStyles]}
        unit={ValueUnit.Megawatts}
        value={results['__total__'].power}
        showIcon
      />
    </div>
  );
}

type BuildingResults = Record<string, { power: number; count: number }>;

function _collectBuildingsFromRecipes(
  results: BuildingResults,
  allRecipes: Record<string, Recipe>,
  entities: Record<string, AnyEntity>,
  recipes: SolverResult['recipes'],
) {
  for (const { slug, multiple } of recipes) {
    const recipe = allRecipes[slug];
    const buildingSlug = recipe.producedIn[0];
    const building = entities[recipe.producedIn[0]] as PoweredBuilding;
    const { totalPower, numBuildings } = groupPowerConsumption(
      building,
      multiple,
    );

    results.__total__.power += totalPower;
    results.__total__.count += numBuildings;
    if (!results[buildingSlug]) results[buildingSlug] = { power: 0, count: 0 };
    results[buildingSlug].power += totalPower;
    results[buildingSlug].count += numBuildings;
  }
}

function _collectExtractionsFromInputs(
  results: BuildingResults,
  entities: Record<string, AnyEntity>,
  inputs: ItemRate[],
) {
  const extractions = extractionsFromInputs(entities, inputs);
  for (const { building: buildingSlug, multiple } of extractions) {
    const building = entities[buildingSlug] as PoweredBuilding;
    const { totalPower, numBuildings } = groupPowerConsumption(
      building,
      multiple,
    );

    results.__total__.power += totalPower;
    results.__total__.count += numBuildings;
    if (!results[buildingSlug]) results[buildingSlug] = { power: 0, count: 0 };
    results[buildingSlug].power += totalPower;
    results[buildingSlug].count += numBuildings;
  }
}
