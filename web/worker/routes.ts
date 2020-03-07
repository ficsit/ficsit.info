/// <reference no-default-lib="true"/>
/// <reference lib="webworker" />
declare var self: ServiceWorkerGlobalScope & typeof globalThis;

import { createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

export function installRoutes() {
  registerRoute(
    new NavigationRoute(createHandlerBoundToURL('/index.html')),
  )

  registerRoute(
    new RegExp('/data/'),
    new StaleWhileRevalidate(),
  );

  registerRoute(
    new RegExp('/assets/icons/'),
    new CacheFirst(),
  );
}
