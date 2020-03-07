/// <reference no-default-lib="true"/>
/// <reference lib="webworker" />
declare var self: ServiceWorkerGlobalScope & typeof globalThis;

import { precacheAndRoute } from 'workbox-precaching';

// for parcel-plugin-service-worker-manifest
declare global {
  var __precacheManifest: { url: string, revision: string }[];
}

export function installPrecacheController() {
  precacheAndRoute(_assetsToPrecache());
}

function _assetsToPrecache() {
  return self.__precacheManifest
    .filter(({ url }) => {
      // Let the browser discover the manifest on its own.
      if (url.endsWith('.webmanifest')) return false;
      return true;
    });
}
