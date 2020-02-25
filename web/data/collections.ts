import { Indexable, Item, Building } from '@local/schema';
import { useState } from 'react';

import { fetchData } from './fetch';

// Global State

const collections = {} as Record<string, any>;

// Hooks

export function useIndex() {
  return _useCollection<Indexable[]>('index');
}

export function useItems() {
  return _useCollection<Record<string, Item>>('items');
}

export function useBuildings() {
  return _useCollection<Record<string, Building>>('buildings');
}

// Internal

function _useCollection<TShape>(kind: string): TShape | undefined {
  const [state, setState] = useState(collections[kind]);
  if (!collections[kind]) {
    fetchData(`${kind}.json`, 'v114480')
      .then((data: any) => {
        collections[kind] = data;
        setState(data);
      });
  }

  return state;
}
