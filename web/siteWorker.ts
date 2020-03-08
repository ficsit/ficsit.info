declare var self: ServiceWorkerGlobalScope & typeof globalThis;

import {
  buildRouter,
  log,
  prefetchData,
  prefetchPackagedAssets,
} from './worker';

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
