import { ItemForm } from '@local/schema';

import { useItem } from '~/data';

import { EntityReference } from './EntityReference';

export interface ItemCountProps {
  slug: string;
  count: number;
  size?: number;
}

export function ItemCount({ slug, count, size }: ItemCountProps) {
  const item = useItem(slug);
  if (item?.form === ItemForm.Liquid) {
    count = count / 1000;
  }

  return <EntityReference slug={slug} badge={count} size={size} />;
}
