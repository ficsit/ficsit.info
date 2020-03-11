import {
  WorkboxPlugin,
  CacheDidUpdateCallbackParam,
  CacheKeyWillBeUsedCallbackParam,
  CacheWillUpdateCallbackParamParam,
  CachedResponseWillBeUsedCallbackParam,
  FetchDidFailCallbackParam,
  FetchDidSucceedCallbackParam,
  RequestWillFetchCallbackParam,
} from 'workbox-core';

function tag(name: string, color: string) {
  return [
    `%c${name}`,
    `background-color: ${color}; border-radius: 0.5em; color: white; font-weight: bold; padding: 2px 0.5em`,
  ];
}

const PREFIX = tag('worker', '#f69e2c');

export function startGroup(...args: any[]) {
  console.groupCollapsed(...PREFIX, ...args);
  return () => console.groupEnd();
}

export function debug(...args: any[]) {
  console.debug(...PREFIX, ...args);
}
export function info(...args: any[]) {
  console.info(...PREFIX, ...args);
}
export function warn(...args: any[]) {
  console.warn(...PREFIX, ...args);
}
export function error(...args: any[]) {
  console.error(...PREFIX, ...args);
}

export class LifecycleLoggingPlugin implements WorkboxPlugin {
  private _prefix: any[];

  constructor(category: string) {
    this._prefix = tag(category, '#0a4576');
  }

  async cacheDidUpdate(details: CacheDidUpdateCallbackParam) {
    console.debug(...this._prefix, `cacheDidUpdate`, details);
  }

  async cacheKeyWillBeUsed(details: CacheKeyWillBeUsedCallbackParam) {
    console.debug(...this._prefix, `cacheKeyWillBeUsed`, details);
    return details.request;
  }

  async cacheWillUpdate(details: CacheWillUpdateCallbackParamParam) {
    console.debug(...this._prefix, `cacheWillUpdate`, details);
    return details.response;
  }

  async cachedResponseWillBeUsed(details: CachedResponseWillBeUsedCallbackParam) {
    console.debug(...this._prefix, `cachedResponseWillBeUsed`, details);
    return details.cachedResponse;
  }

  async fetchDidFail(details: FetchDidFailCallbackParam) {
    console.debug(...this._prefix, `fetchDidFail`, details);
  }

  async fetchDidSucceed(details: FetchDidSucceedCallbackParam) {
    console.debug(...this._prefix, `fetchDidSucceed`, details);
    return details.response;
  }

  async requestWillFetch(details: RequestWillFetchCallbackParam) {
    console.debug(...this._prefix, `requestWillFetch`, details);
    return details.request;
  }
}
