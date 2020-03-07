/// <reference no-default-lib="true"/>
/// <reference lib="webworker" />
declare var self: ServiceWorkerGlobalScope & typeof globalThis;

import * as worker from './worker';

worker.installPrecacheController();
worker.installRoutes();
