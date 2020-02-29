import { useParams } from 'react-router';
import { Building } from '@local/schema';

import { useBuildings } from '../data';
import { MasterDetailLayout } from '../layouts';
import { EntityList } from '../components/EntityList';
import { EntitySummary } from '../components/EntitySummary';

export function Building() {
  const { slug } = useParams<{ slug?: string }>();
  const buildings = useBuildings();
  if (!buildings) return <div>…</div>;

  const building = slug ? buildings[slug] : undefined;

  return (
    <MasterDetailLayout 
      master={<EntityList entitiesById={buildings} />}
      detail={_renderDetail(building)}
    />
  );
}

function _renderDetail(building?: Building) {
  if (!building) return `…`;

  return (
    <article>
      <EntitySummary entity={building} imageSize={256} />
    </article>
  );
}
