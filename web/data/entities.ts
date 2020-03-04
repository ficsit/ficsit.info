import { useEntities, useBuildings, useItems, useRecipes } from './collections';

export function useEntity(slug?: string) {
  return typeof slug === 'string' ? useEntities()?.[slug] : undefined;
}

export function useBuilding(slug?: string) {
  return typeof slug === 'string' ? useBuildings()?.[slug] : undefined;
}

export function useItem(slug?: string) {
  return typeof slug === 'string' ? useItems()?.[slug] : undefined;
}

export function useRecipe(slug?: string) {
  return typeof slug === 'string' ? useRecipes()?.[slug] : undefined;
}
