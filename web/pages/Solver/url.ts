import { SolverConfiguration, SolverConstraintSubjectKind, SolverConstraintType } from './solve';

export function encodeConfig(config: SolverConfiguration) {
  const parts = [];
  for (const { slug, perMinute } of config.targets) {
    parts.push(`t=${slug}:${perMinute}`);
  }
  for (const { subject, type, value } of config.constraints) {
    parts.push(`c=${subject.kind}:${subject.slug},${type},${value}`);
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
  const config = { targets: [], constraints: [] } as SolverConfiguration;

  const parts = search?.substr(1).split('&') || [];
  for (const part of parts) {
    if (part.startsWith('t=')) {
      const [slug, perMinute] = part.substr(2).split(':');
      config.targets.push({ slug, perMinute: parseInt(perMinute, 10) });
    } else if (part.startsWith('c=')) {
      const [subject, type, value] = part.substr(2).split(',');
      const [subjectKind, slug] = subject.split(':');
      config.constraints.push({
        subject: {
          kind: subjectKind as SolverConstraintSubjectKind,
          slug,
        },
        type: type as SolverConstraintType,
        value: parseInt(value, 10),
      });
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
