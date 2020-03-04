import { Indexable, Item, Building, Recipe } from '@local/schema';
import { useState } from 'react';

import { fetchData } from './fetch';

export function useIndex() {
  return _useCollection<Indexable[]>('index');
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
