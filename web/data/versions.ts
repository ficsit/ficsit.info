import { makeDataHook } from './fetch';

interface Versions {
  branches: Record<string, number>;
  builds: Record<
    number,
    {
      public: string;
      patchNotes: string;
    }
  >;
}

export const useVersionsData = makeDataHook('versions', (versions: Versions) => versions);

export const useVersions = useVersionsData;
