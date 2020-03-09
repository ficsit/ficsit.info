import { AnyEntity, EntityKind, ItemForm } from '@local/schema';
import { css } from '@emotion/core';

import { EntityLink } from '~/components/EntityLink';
import { useEntities } from '~/data';
import { Rate } from '~/components/Rate';
import { sizing, colors } from '~/style';

import { SolverResult, ItemRate } from './solve';

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
