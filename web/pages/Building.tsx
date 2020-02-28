import { useParams } from 'react-router';
import { Building } from '@local/schema';

import { BuildingImage } from '../components/Image';
import { useBuildings } from '../data';
import { MasterDetailLayout } from '../layouts';
import { EntityList } from '../components/EntityList';

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
    <React.Fragment>
      <h2>{building.name}</h2>
      <BuildingImage building={building} size={256} />
      <p>{building.description}</p>
    </React.Fragment>
  )
}
