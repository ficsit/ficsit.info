import { EntityReference } from './EntityReference';

export interface ItemCountProps {
  slug: string;
  count?: number | false;
  size?: number;
}

export function ItemCount({ slug, count, size }: ItemCountProps) {
  return <EntityReference slug={slug} badge={count} size={size} />;
}
