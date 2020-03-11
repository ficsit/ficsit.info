import { WorkboxPlugin, CacheDidUpdateCallbackParam } from 'workbox-core';
import { responsesAreSame } from 'workbox-broadcast-update';

export class RedirectPlugin implements WorkboxPlugin {
  constructor(private _info: RequestInfo, private _init?: RequestInit) {}

  async requestWillFetch() {
    return new Request(this._info, this._init);
  }

  async cacheKeyWillBeUsed() {
    return new Request(this._info, this._init);
  }
}

export class ResponseChangedPlugin implements WorkboxPlugin {
  private _headers = ['content-length', 'etag', 'last-modified'];

  constructor(private _callback: (details: CacheDidUpdateCallbackParam) => void | Promise<void>) {}

  async cacheDidUpdate(details: CacheDidUpdateCallbackParam) {
    if (!details.oldResponse || !responsesAreSame(details.oldResponse, details.newResponse, this._headers)) {
      return await this._callback(details);
    }
  }
}
