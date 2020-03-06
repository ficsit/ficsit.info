import { EntityKind, Recipe, Schematic, AnyEntity } from '@local/schema';

export function entityUrl({ kind, slug }: AnyEntity) {
  switch (kind) {
    case EntityKind.Building: return buildingUrl(slug);
    case EntityKind.Item: return itemUrl(slug);
  }
}

export function buildingUrl(slug: string) {
  return `/buildings/${slug}`;
}

export function itemUrl(slug: string) {
  return `/items/${slug}`;
}

export function recipeUrl({ slug }: Recipe) {
  return `/recipes/${slug}`;
}

export function schematicUrl({ slug }: Schematic) {
  return `/research/${slug}`;
}
