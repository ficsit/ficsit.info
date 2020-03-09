import { makeDataHook } from './fetch';

export const useVersionsData = makeDataHook(
  'versions',
  (versions: Record<string, number>) => versions,
);

export const useVersions = useVersionsData;
