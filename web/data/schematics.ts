import { Schematic } from '@local/schema';

import { makeDataHook } from './fetch';

export function useSchematics() {
  return useSchematicData()?.bySlug;
}

export function useSchematic(slug?: string) {
  const schematics = useSchematics();
  return typeof slug === 'string' ? schematics?.[slug] : undefined;
}

// Raw Data

const useSchematicData = makeDataHook('recipes', (bySlug: Record<string, Schematic>) => {
  return { bySlug };
});
