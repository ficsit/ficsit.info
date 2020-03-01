import { useParams } from 'react-router';
import { Item } from '@local/schema';

import { useItems } from '~/data';
import { MasterDetailLayout } from '~/layouts';
import { EntityList } from '~/components/EntityList';
import { EntitySummary } from '~/components/EntitySummary';
import { ItemRecipes } from './ItemRecipes';

export function ItemPage() {
  const { slug } = useParams<{ slug?: string }>();
  const items = useItems();
  if (!items) return <div>…</div>;

  const item = slug ? items[slug] : undefined;

  return (
    <MasterDetailLayout 
      master={<EntityList entitiesById={items} />}
      detail={_renderDetail(item)}
    />
  );
}

function _renderDetail(item?: Item) {
  if (!item) return `…`;

  const statistics = {} as Record<string, React.ReactNode>;
  
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
    <article>
      <EntitySummary entity={item} imageSize={128} statistics={statistics} />
      <ItemRecipes item={item} />
    </article>
  )
}
