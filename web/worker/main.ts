declare var self: ServiceWorkerGlobalScope & typeof globalThis;

import * as log from './log';
import { prefetchData, prefetchPackagedAssets } from './prefetch';
import { buildRouter } from './routes';

const router = buildRouter();

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const endGroup = log.startGroup('install');

      await prefetchPackagedAssets(router);
      await prefetchData(router);

      // Immediately activate.
      await self.skipWaiting();

      endGroup();
    })(),
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const endGroup = log.startGroup('activate');

      // Immediately take over existing pages.
      await self.clients.claim();

      endGroup();
    })(),
  );
});
