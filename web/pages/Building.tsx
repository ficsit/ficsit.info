import { useParams } from 'react-router';
import { Building } from '@local/schema';
import { css } from '@emotion/core';

import { BuildingImage } from '../components/Icon';
import { useBuildings } from '../data';
import { MasterDetailLayout } from '../layouts';
import { EntityList } from '../components/EntityList';
import { colors } from '../style';

const borderSize = 2;
const basePadding = 16;
const imageSize = 256;
const imageInset = 160;

const headerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  margin: 0,
  fontSize: 36,
  fontWeight: 'lighter',
  textTransform: 'uppercase',
  lineHeight: '1.0',
  paddingLeft: imageSize + basePadding * 2 + borderSize,
  paddingBottom: basePadding,
  minHeight: imageInset - basePadding,
});

const summaryStyles = css({
  display: 'flex',
  border: `${borderSize}px solid ${colors.Light.N400}`,
  borderRadius: 16,
  padding: basePadding,
  backgroundColor: colors.Light.N0,
  'p': {
    margin: 0,
    flex: 1,
  },
  'picture': {
    marginTop: -imageInset,
    marginRight: basePadding,
    filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.4))',
  },
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
        <h2 css={headerStyles}>{building.name}</h2>
        <main>
          <div css={summaryStyles}>
            <BuildingImage building={building} size={256} />
            <p>{building.description}</p>
          </div>
        </main>
      </article>
    </React.Fragment>
  )
}
