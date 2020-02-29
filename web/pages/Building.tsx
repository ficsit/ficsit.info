import { useParams } from 'react-router';
import { Building } from '@local/schema';
import { css } from '@emotion/core';

import { BuildingImage } from '../components/Icon';
import { useBuildings } from '../data';
import { MasterDetailLayout } from '../layouts';
import { EntityList } from '../components/EntityList';
import { colors } from '../style';

const basePadding = 16;
const imageInset = 128;

const summaryStyles = css({
  border: `3px solid ${colors.Light.N400}`,
  borderRadius: 16,
  padding: basePadding,
  paddingTop: basePadding + imageInset,
  backgroundColor: colors.Light.N0,
  'p:first-child': {
    marginTop: 0,
  },
  'p:last-child': {
    marginBottom: 0,
  },
});

const headerStyles = css({
  display: 'flex',
  padding: basePadding,
  alignItems: 'flex-end',
  'picture': {
    filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.5))',
    order: 1,
    marginBottom: -(imageInset + basePadding),
    marginRight: basePadding * 2,
  },
  'h2': {
    order: 2,
    margin: 0,
    fontSize: 36,
    fontWeight: 'lighter',
    textTransform: 'uppercase',
    lineHeight: '1.0',
  }
});

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
      <article>
        <header css={headerStyles}>
          <h2>{building.name}</h2>
          <BuildingImage building={building} size={256} />
        </header>
        <main css={summaryStyles}>
          <p>{building.description}</p>
        </main>
      </article>
    </React.Fragment>
  )
}
