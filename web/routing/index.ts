import { Entity, EntityKind, Recipe, Schematic } from '@local/schema';

export function entityUrl({ kind, slug}: Entity) {
  switch (kind) {
    case EntityKind.Building: return `/buildings/${slug}`;
    case EntityKind.Item: return `/items/${slug}`;
  }
}

export function recipeUrl({ slug }: Recipe) {
  return `/recipes/${slug}`;
}

export function schematicUrl({ slug }: Schematic) {
  return `/research/${slug}`;
}
