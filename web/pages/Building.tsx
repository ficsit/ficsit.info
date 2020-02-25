import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Building } from '@local/schema';

import { BuildingImage } from '../components/Image';
import { useBuildings } from '../data';
import { MasterDetailLayout } from '../layouts';

export function Building() {
  const { slug } = useParams<{ slug?: string }>();
  const buildings = useBuildings();
  if (!buildings) return <div>…</div>;

  const building = slug ? buildings[slug] : undefined;

  return (
    <MasterDetailLayout 
      master={_renderMaster(Object.values(buildings).filter(b => !!b.icon))}
      masterHeader='Buildings'
      detail={_renderDetail(building)}
      detailHeader={building?.name}
    />
  );
}

function _renderMaster(buildings: Building[]) {
  return (
    <ol>
      {buildings.map(building =>
        <li key={building.slug}>
          <NavLink to={`/buildings/${building.slug}`} >{building.name}</NavLink>
        </li>
      )}
    </ol>
  )
}

function _renderDetail(building?: Building) {
  if (!building) return `…`;

  return (
    <React.Fragment>
      <p>{building.description}</p>
      <BuildingImage building={building} width={256} />
    </React.Fragment>
  )
}
