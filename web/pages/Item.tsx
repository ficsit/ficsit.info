import { useParams } from 'react-router';
import { Item } from '@local/schema';
import { css } from '@emotion/core';

import { ItemImage } from '../components/Image';
import { useItems } from '../data';
import { MasterDetailLayout } from '../layouts';
import { EntityLink } from '../components/EntityLink';

const listStyle = css({
  margin: 0,
  padding: 0,
});

const listItemStyle = css({
  display: 'flex',
});

export function Item() {
  const { slug } = useParams<{ slug?: string }>();
  const items = useItems();
  if (!items) return <div>…</div>;

  const item = slug ? items[slug] : undefined;

  return (
    <MasterDetailLayout 
      master={_renderMaster(Object.values(items))}
      masterHeader='Items'
      detail={_renderDetail(item)}
      detailHeader={item?.name}
    />
  );
}

function _renderMaster(items: Item[]) {
  return (
    <ol css={listStyle}>
      {items.map(item => <EntityLink key={item.slug} entity={item} css={listItemStyle} />)}
    </ol>
  )
}

function _renderDetail(item?: Item) {
  if (!item) return `…`;

  return (
    <React.Fragment>
      <ItemImage item={item} width={128} />
      <p>{item.description}</p>
    </React.Fragment>
  )
}
