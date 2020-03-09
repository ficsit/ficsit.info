import { AnyEntity, EntityKind } from '@local/schema';
import { makeDataHook } from './fetch';

export function useEntities() {
  return useEntityData()?.bySlug;
}

export function useEntity(slug?: string) {
  const entities = useEntities();
  return typeof slug === 'string' ? entities?.[slug] : undefined;
}

export function useBuilding(slug?: string) {
  const entity = useEntity(slug);
  return entity?.kind === EntityKind.Building ? entity : undefined;
}

export function useItem(slug?: string) {
  const entity = useEntity(slug);
  return entity?.kind === EntityKind.Item ? entity : undefined;
}

export function useEntitiesByKind<TKind extends EntityKind>(kind: TKind) {
  return useEntityData()?.byKindBySlug[kind];
}

// Raw Data

export const useEntityData = makeDataHook(
  'experimental/entities',
  (bySlug: Record<string, AnyEntity>) => {
    const byKindBySlug = {} as {
      [TKind in EntityKind]: Record<
        string,
        Extract<AnyEntity, { kind: TKind }>
      >;
    };
    for (const entity of Object.values(bySlug)) {
      if (!byKindBySlug[entity.kind]) byKindBySlug[entity.kind] = {};
      byKindBySlug[entity.kind][entity.slug] = entity;
    }

    return { bySlug, byKindBySlug: byKindBySlug };
  },
);
