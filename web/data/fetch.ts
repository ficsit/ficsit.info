import { useState } from 'react';

export function makeDataHook<TResult extends object>(path: string, transform: (data: any) => TResult) {
  let promise: Promise<TResult> | undefined;
  let transformed: TResult | undefined;

  return function useData() {
    const [state, setState] = useState(transformed);
    if (!transformed) {
      if (!promise) promise = fetchData(path).then(transform);
      promise.then(result => {
        transformed = result;
        setState(result);
      })
    }

    return state;
  }
}

export async function fetchData(path: string) {
  const response = await fetch(_dataUrl(`${path}.json`, 'v115821'), {
    method: 'GET',
  });

  return await response.json();
}

// Internal

function _dataUrl(path: string, version: string) {
  return `${process.env.APP_ORIGIN}data/${version}/${path}`;
}
