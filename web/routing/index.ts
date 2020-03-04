import { Entity, EntityKind } from '@local/schema';

export function entityUrl(entity: Entity) {
  switch (entity.kind) {
    case EntityKind.Building: return `/buildings/${entity.slug}`;
    case EntityKind.Item: return `/items/${entity.slug}`;
    case EntityKind.Recipe: return `/recipes/${entity.slug}`;
    case EntityKind.Schematic: return `/research/${entity.slug}`;
  }
}
