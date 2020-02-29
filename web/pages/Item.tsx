import { useParams } from 'react-router';
import { Item } from '@local/schema';

import { useItems } from '../data';
import { MasterDetailLayout } from '../layouts';
import { EntityList } from '../components/EntityList';
import { EntitySummary } from '../components/EntitySummary';

export function Item() {
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

  return (
    <article>
      <EntitySummary entity={item} imageSize={128} />
    </article>
  )
}
