/// <reference no-default-lib="true"/>
/// <reference lib="webworker" />
declare var self: ServiceWorkerGlobalScope & typeof globalThis;

import { RouteHandler } from 'workbox-core';
import { NavigationRoute, Router, RegExpRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

export function buildRouter() {
  const router = new Router();
  registerRoutes(router);

  router.addFetchListener();
  router.addCacheListener();

  return router;
}

export function registerRoutes(router:Router) {
  // Redirect all navigation events to the index.
  const indexCache = new NetworkFirst({ cacheName: 'index', networkTimeoutSeconds: 0.5 });
  const indexHandler: RouteHandler = ({ ...args }) => {
    return indexCache.handle({ ...args, request: new Request('/index.html') });
  };
  router.registerRoute(new NavigationRoute(indexHandler));

  // Any URL with a hash in it can be cached forever.
  router.registerRoute(new RegExpRoute(/\.[0-9a-f]{8}\./, new CacheFirst({ cacheName: 'packaged' })));
  router.registerRoute(new RegExpRoute(/\/assets\/icons\//, new CacheFirst({ cacheName: 'icons' })));

  // And data can be aggressively cached.
  router.registerRoute(new RegExpRoute(/\/data\/.*/, new StaleWhileRevalidate({ cacheName: 'data' })));
}
