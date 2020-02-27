import { useParams } from 'react-router';
import { Item } from '@local/schema';

import { ItemImage } from '../components/Image';
import { useItems } from '../data';
import { MasterDetailLayout } from '../layouts';
import { EntityList } from '../components/EntityList';

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
    <React.Fragment>
      <h2>{item.name}</h2>
      <ItemImage item={item} size={128} />
      <p>{item.description}</p>
    </React.Fragment>
  )
}
