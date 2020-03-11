import { NavigationRoute, Router, Route } from 'workbox-routing';
import { BroadcastUpdatePlugin } from 'workbox-broadcast-update';
import { Handler } from 'workbox-routing/_types';
import { HTTPMethod } from 'workbox-routing/utils/constants';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

import { RedirectPlugin, ResponseChangedPlugin } from './handlers';
import { prefetchData } from './prefetch';

export function buildRouter() {
  const router = new Router();
  registerRoutes(router);

  router.addFetchListener();
  router.addCacheListener();

  return router;
}

export function registerRoutes(router: Router) {
  // Redirect all navigation events to the index.
  const indexCache = new NetworkFirst({
    cacheName: 'core',
    networkTimeoutSeconds: 2.5,
    plugins: [
      new RedirectPlugin('/', {
        cache: 'no-cache',
        redirect: 'follow',
        credentials: 'same-origin',
      }),
      new ResponseChangedPlugin(({ oldResponse }) => {
        if (!oldResponse) return; // Skip; we're installing.
        prefetchData(router);
      }),
    ],
  });
  router.registerRoute(new NavigationRoute(indexCache));
  router.registerRoute(path('/', indexCache));

  // And also make sure we store other core (refreshable) data.
  const coreCache = new NetworkFirst({ cacheName: 'core' });
  router.registerRoute(path('/site.webmanifest', coreCache));

  // Any URL with a hash in it can be cached forever.
  const packagedCache = new CacheFirst({ cacheName: 'packaged' });
  router.registerRoute(path(/\.[0-9a-f]{8}\./, packagedCache));

  const iconsCache = new CacheFirst({ cacheName: 'icons' });
  router.registerRoute(path(new RegExp('^/assets/icons/'), iconsCache));

  // And data can be aggressively cached (we refresh it on index change).
  const dataCache = new StaleWhileRevalidate({
    cacheName: 'data',
    plugins: [new BroadcastUpdatePlugin({})],
  });
  router.registerRoute(path(new RegExp('^/data/'), dataCache));
}

function path(pathMatch: string | RegExp, handler: Handler, method?: HTTPMethod) {
  let match;
  if (typeof pathMatch === 'string') {
    match = ({ url: { pathname } }: { url: URL }) => pathMatch === pathname;
  } else {
    match = ({ url: { pathname } }: { url: URL }) => pathMatch.test(pathname);
  }

  return new Route(match, handler, method);
}
