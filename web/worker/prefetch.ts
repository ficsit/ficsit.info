/// <reference no-default-lib="true"/>
/// <reference lib="webworker" />
declare var self: ServiceWorkerGlobalScope & typeof globalThis;

import { Router } from 'workbox-routing';

import * as log from './log';

// for parcel-plugin-service-worker-manifest
declare global {
  var __precacheManifest: { url: string, revision: string }[];
}

export async function prefetchPackagedAssets(router: Router) {
  const endGroup = log.startGroup('Prefetching packaged assets');
  const assetsToPrefetch = __precacheManifest
    .filter(({ url }) => /\.[0-9a-f]{8}\./.test(url));

  try {
    await Promise.all([
      router.handleRequest({ request: new Request('/index.html') }),
      ...assetsToPrefetch.map(({ url }) =>
        router.handleRequest({ request: new Request(url) })
      ),
    ]);
  } catch (error) {
    console.warn(`Failed to prefetch packaged assets:`, error);
  }

  endGroup();
}

export async function prefetchData(router: Router) {
  const endGroup = log.startGroup('Prefetching data');
  try {
    await Promise.all([
      router.handleRequest({ request: new Request('/data/experimental/entities.json') }),
      router.handleRequest({ request: new Request('/data/experimental/recipes.json') }),
      router.handleRequest({ request: new Request('/data/experimental/schematics.json') }),
    ]);
  } catch (error) {
    console.warn(`Failed to prefetch data:`, error);
  }
  endGroup();
}
