import { useParams } from 'react-router';
import { EntityKind } from '@local/schema';
import { css } from '@emotion/core';

import { useItem } from '~/data';
import { sizing } from '~/style';
import { MasterDetailLayout } from '~/layouts';
import { EntityList } from '~/components/EntityList';
import { EntitySummary } from '~/components/EntitySummary';
import { ItemRecipes } from './ItemRecipes';
import { ItemUses } from './ItemUses';

const rootStyles = css({
  padding: sizing.sectionPadding,
});

const detailsStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  '@media(max-width: 600px)': {
    gridTemplateColumns: 'repeat(1, 1fr)',
  },
});

export function ItemPage() {
  const { slug } = useParams<{ slug?: string }>();

  return (
    <MasterDetailLayout 
      master={<EntityList kind={EntityKind.Item} />}
      detail={<_Detail slug={slug} />}
    />
  );
}

function _Detail({ slug }: { slug?: string }) {
  const item = useItem(slug);
  if (!item) return <div>…</div>;

  const statistics = {} as Record<string, React.ReactNode>;
  
  if (item.raw) {
    statistics[`Source`] = `extracted`;
  }

  if (item.stackSize) {
    statistics[`Stack Size`] = item.stackSize;
  } else {
    statistics[`Form`] = item.form;
  }
  if (item.radioactivity) {
    // TODO: display this in a more meaningful way.
    statistics[`Radioactive!`] = `decay rate: ${item.radioactivity.decay}`;
  }
  if (item.equipment?.slot) {
    statistics[`Equipment Slot`] = item.equipment.slot;
  }
  if (item.equipment?.cost?.length) {
    // TODO: fix
    statistics[`Cost To Use`] = JSON.stringify(item.equipment.cost);
  }
  if (item.fuel?.energy) {
    // TODO: component for units/values.
    // TODO: better unit & value for liquids. (MJ / ml^3?)
    statistics[`Energy As Fuel`] = `${item.fuel.energy} MJ / item`;
  }

  return (
    <article css={rootStyles}>
      <EntitySummary entity={item} imageSize={128} statistics={statistics}/>
      <div css={detailsStyles}>
        <ItemRecipes item={item} />
        <ItemUses item={item} />
      </div>
    </article>
  )
}
