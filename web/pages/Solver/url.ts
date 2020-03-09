import { SolverConfiguration } from './solve';

export function encodeConfig(config: SolverConfiguration) {
  const parts = [];
  for (const { slug, perMinute } of config.targets) {
    parts.push(`t=${slug}:${perMinute}`);
  }
  if (config.optimizeResiduals) {
    parts.push('or');
  }
  if (config.includeAlternateRecipes) {
    parts.push('ar');
  }

  return `?${parts.join('&')}`;
}

export function decodeConfig(search?: string): SolverConfiguration {
  if (!search) return { targets: [] };

  const config = { targets: [] } as SolverConfiguration;

  const parts = search.substr(1).split('&');
  for (const part of parts) {
    if (part.startsWith('t=')) {
      const [slug, perMinute] = part.substr(2).split(':');
      config.targets.push({ slug, perMinute: parseInt(perMinute, 10) });
    } else if (part === 'or') {
      config.optimizeResiduals = true;
    } else if (part === 'ar') {
      config.includeAlternateRecipes = true;
    } else {
      console.warn(`Unknown URL part:`, part);
    }
  }

  return config;
}
