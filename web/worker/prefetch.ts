// for parcel-plugin-service-worker-manifest
declare let __precacheManifest: { url: string; revision: string }[];

import { Router } from 'workbox-routing';

import * as log from './log';

const noCache: RequestInit = { cache: 'no-cache' };

export async function prefetchPackagedAssets(router: Router) {
  const endGroup = log.startGroup('Prefetching packaged assets');
  const assetsToPrefetch = __precacheManifest.filter(({ url }) => /\.[0-9a-f]{8}\./.test(url));

  try {
    await Promise.all([
      router.handleRequest({
        request: new Request('/', noCache),
      }),
      router.handleRequest({
        request: new Request('/site.webmanifest', noCache),
      }),
      ...assetsToPrefetch.map(({ url }) => router.handleRequest({ request: new Request(url) })),
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
      router.handleRequest({
        request: new Request('/data/experimental/entities.json', noCache),
      }),
      router.handleRequest({
        request: new Request('/data/experimental/recipes.json', noCache),
      }),
      router.handleRequest({
        request: new Request('/data/experimental/schematics.json', noCache),
      }),
      router.handleRequest({
        request: new Request('/data/versions.json', noCache),
      }),
    ]);
  } catch (error) {
    console.warn(`Failed to prefetch data:`, error);
  }
  endGroup();
}
