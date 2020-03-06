import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { EntityKind } from '@local/schema';
import { css } from '@emotion/core';

import { useBuilding } from '~/data';
import { sizing } from '~/style';
import { MasterDetailLayout } from '~/layouts';
import { EntityList } from '~/components/EntityList';
import { EntitySummary } from '~/components/EntitySummary';
import { buildingUrl } from '~/routing';

const rootStyles = css({
  padding: sizing.sectionPadding,
});

export function BuildingPage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  return (
    <MasterDetailLayout 
    master={
      <EntityList 
        kind={EntityKind.Building} 
        selected={slug} 
        onChange={slug => navigate(buildingUrl(slug))} 
      />
    }
      detail={<_Detail slug={slug} />}
    />
  );
}

function _Detail({ slug }: { slug?: string }) {
  const building = useBuilding(slug);
  let [clockSpeed, setClockSpeed] = useState(1.0);
  if (!building) return <React.Fragment>…</React.Fragment>;

  const statistics = {} as Record<string, React.ReactNode>;

  if (building.overclockable) {
    const overclockPercent = Math.round(clockSpeed * 100);
    statistics[`Overclock (${overclockPercent}%)`] = 
      <input 
        type='range' 
        min={1} 
        max={250} 
        value={clockSpeed * 100} 
        onChange={({ target }) => setClockSpeed(parseInt(target.value) / 100)}
      />;
  } else {
    // Make sure that we don't display weird values if not overclockable.
    clockSpeed = 1.0;
  }

  if (building.powerConsumption) {
    const { amount, exponent } = building.powerConsumption;
    const consumption = (amount * Math.pow(clockSpeed, exponent));
    // TODO: better unit handling (per item, per …).
    statistics[`Power Consumption`] = `${consumption.toFixed(1)} MW`;
  }

  if (building.powerProduction) {
    const { amount, exponent } = building.powerProduction;
    const production = (amount * Math.pow(clockSpeed, exponent));
    // TODO: better unit handling (per item, per …).
    statistics[`Power Production`] = `${production.toFixed(1)} MW`;
  }

  if (building.storage) {
    const { x, y } = building.storage;
    statistics[`Storage`] = `${x * y} slots (${x} x ${y})`;
  }

  if (building.conveyor) {
    const { speed } = building.conveyor;
    // TODO: units.
    statistics[`Conveyor`] = `${speed / 2} items / min`;
  }

  return (
    <article css={rootStyles}>
      <EntitySummary entity={building} imageSize={256} statistics={statistics} />
    </article>
  );
}
