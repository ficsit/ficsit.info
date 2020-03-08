import { ItemForm } from '@local/schema';

import { useItem } from '~/data';

import { EntityReference } from './EntityReference';

export interface ItemCountProps {
  slug: string;
  count?: number | false;
  size?: number;
}

export function ItemCount({ slug, count, size }: ItemCountProps) {
  const item = useItem(slug);

  let badge;
  if (typeof count === 'number' && Number.isFinite(count)) {
    badge = item?.form === ItemForm.Liquid ? count / 1000 : count;
  }

  return <EntityReference slug={slug} badge={badge} size={size} />;
}
