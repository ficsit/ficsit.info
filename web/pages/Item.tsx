import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Item } from '@local/schema';

import { ItemImage } from '../components/Image';
import { useItems } from '../data';
import { MasterDetailLayout } from '../layouts';

export function Item() {
  const { slug } = useParams<{ slug?: string }>();
  const items = useItems();
  if (!items) return <div>…</div>;

  const item = slug ? items[slug] : undefined;

  return (
    <MasterDetailLayout 
      master={_renderMaster(Object.values(items).filter(i => !!i.icon))}
      masterHeader='Items'
      detail={_renderDetail(item)}
      detailHeader={item?.name}
    />
  );
}

function _renderMaster(items: Item[]) {
  return (
    <ol>
      {items.map(item =>
        <li key={item.slug}>
          <NavLink to={`/items/${item.slug}`} >{item.name}</NavLink>
        </li>
      )}
    </ol>
  )
}

function _renderDetail(item?: Item) {
  if (!item) return `…`;

  return (
    <React.Fragment>
      <p>{item.description}</p>
      <ItemImage item={item} width={128} />
    </React.Fragment>
  )
}
