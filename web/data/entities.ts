import { useEntities, useBuildings, useItems, useRecipes } from './collections';

export function useEntity(slug: string) {
  return useEntities()?.[slug];
}

export function useBuilding(slug: string) {
  return useBuildings()?.[slug];
}

export function useItem(slug: string) {
  return useItems()?.[slug];
}

export function useRecipe(slug: string) {
  return useRecipes()?.[slug];
}
