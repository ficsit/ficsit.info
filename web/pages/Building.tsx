import { useParams } from 'react-router';
import { Building } from '@local/schema';
import { css } from '@emotion/core';

import { BuildingImage } from '../components/Image';
import { EntityLink } from '../components/EntityLink';
import { useBuildings } from '../data';
import { MasterDetailLayout } from '../layouts';

const listStyle = css({
  margin: 0,
  padding: 0,
});

const listItemStyle = css({
  display: 'flex',
});

export function Building() {
  const { slug } = useParams<{ slug?: string }>();
  const buildings = useBuildings();
  if (!buildings) return <div>…</div>;

  const building = slug ? buildings[slug] : undefined;

  return (
    <MasterDetailLayout 
      master={_renderMaster(Object.values(buildings))}
      masterHeader='Buildings'
      detail={_renderDetail(building)}
      detailHeader={building?.name}
    />
  );
}

function _renderMaster(buildings: Building[]) {
  return (
    <ol css={listStyle}>
      {buildings.map(building => <EntityLink key={building.slug} entity={building} css={listItemStyle} />)}
    </ol>
  )
}

function _renderDetail(building?: Building) {
  if (!building) return `…`;

  return (
    <React.Fragment>
      <BuildingImage building={building} width={256} />
      <p>{building.description}</p>
    </React.Fragment>
  )
}
