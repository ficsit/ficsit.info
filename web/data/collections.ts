import { Indexable, Item, Building, Recipe } from '@local/schema';
import { useState } from 'react';

import { fetchData } from './fetch';

// Global State

const collections = {} as Record<string, any>;

// Hooks

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

function _useCollection<TShape>(kind: string): TShape | undefined {
  const [state, setState] = useState(collections[kind]);
  if (!collections[kind]) {
    fetchData(`${kind}.json`, 'v115821')
      .then((data: any) => {
        collections[kind] = data;
        setState(data);
      });
  }

  return state;
}
