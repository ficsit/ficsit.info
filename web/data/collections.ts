import { Entity, Item, Building, Recipe } from '@local/schema';
import { useState } from 'react';

import { fetchData } from './fetch';
import { memoize } from '~/utility';

export function useIndex() {
  return _useCollection<Entity[]>('index');
}

export function useEntities() {
  return _entitiesBySlug(useIndex());
}

export function useBuildings() {
  return _useCollection<Record<string, Building>>('buildings');
}

export function useItems() {
  return _useCollection<Record<string, Item>>('items');
}

export function useRecipes() {
  return _useCollection<Record<string, Recipe>>('recipes');
}

// Internal

const _collectionPromises = {} as Record<string, Promise<any>>;
const _collections = {} as Record<string, any>;

function _useCollection<TShape>(kind: string): TShape | undefined {
  const [state, setState] = useState(_collections[kind]);
  if (!_collections[kind]) {
    if (!_collectionPromises[kind]) {
      _collectionPromises[kind] = fetchData(`${kind}.json`, 'v115821');
    }

    _collectionPromises[kind].then((data: any) => {
      _collections[kind] = data;
      setState(data);
    });
  }

  return state;
}

const _entitiesBySlug = memoize((entities?: Entity[]) => {
  if (!entities) return;

  const bySlug = {} as Record<string, Entity>;
  for (const entity of entities) {
    bySlug[entity.slug] = entity;
  }
  return bySlug;
});
