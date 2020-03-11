import { useState } from 'react';

export function makeDataHook<TResult extends object>(path: string, transform: (data: any) => TResult) {
  let promise: Promise<TResult> | undefined;
  let transformed: TResult | undefined;

  function useData() {
    const [state, setState] = useState(transformed);
    if (!transformed) {
      if (!promise) promise = fetchData(path).then(transform);
      promise.then(result => {
        transformed = result;
        setState(result);
      });
    }

    return state;
  }

  useData.invalidate = function invalidate() {
    if (!transformed) return;
    promise = undefined;
    transformed = undefined;
  };

  return useData;
}

export async function fetchData(path: string) {
  const response = await fetch(_dataUrl(`${path}.json`), {
    method: 'GET',
    credentials: 'include',
  });

  return await response.json();
}

// Internal

function _dataUrl(path: string) {
  return `${process.env.APP_ORIGIN}data/${path}`;
}
