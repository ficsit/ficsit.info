import { useState } from 'react';
import { useParams } from 'react-router';
import { Building } from '@local/schema';

import { useBuildings } from '~/data';
import { MasterDetailLayout } from '~/layouts';
import { EntityList } from '~/components/EntityList';
import { EntitySummary } from '~/components/EntitySummary';

export function BuildingPage() {
  const { slug } = useParams<{ slug?: string }>();
  const buildings = useBuildings();
  if (!buildings) return <div>…</div>;

  const building = slug ? buildings[slug] : undefined;

  return (
    <MasterDetailLayout 
      master={<EntityList entitiesById={buildings} />}
      detail={<_Detail building={building} />}
    />
  );
}

function _Detail({ building }: { building?: Building }) {
  let [clockSpeed, setClockSpeed] = useState(1.0);

  if (!building) return <React.Fragment>`…`</React.Fragment>;

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
    <article>
      <EntitySummary entity={building} imageSize={256} statistics={statistics} />
    </article>
  );
}
