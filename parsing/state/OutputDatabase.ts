import { paramCase } from 'param-case';
import { Entity, EntityKind, EntityByKind, Slug, Indexable } from '@local/schema';

import { normalizeClassName } from './HeaderDatabase';

export type WithoutSlug<TEntity extends Entity> = Omit<TEntity, 'slug'>;

/**
 * Database that maintains a set of all entities that should be outputted, and 
 * handles references from internal class names to them.
 */
export class OutputDatabase {
  _entitiesByClassName = new Map<string, Entity>();
  _entitiesByBaseSlug = new Map<string, Entity[]>();
  _entitiesByKind = new Map<string, Entity[]>();

  register(entity: WithoutSlug<Entity>, classNames: (string | undefined)[], slugPrefix?: string) {
    this._assignBySlug(entity, slugPrefix);
    this._assignByKind(entity);
    for (const className of classNames) {
      if (!className) continue;
      this._assignByClassName(entity, className);
    }
  }

  reference(targetClassName: string, ...classNames: string[]) {
    const target = this.getOrDie(targetClassName);
    for (const className of classNames) {
      if (this._entitiesByClassName.get(className)) {
        throw new Error(`Refusing to overwrite ${className} with a reference to ${targetClassName}`);
      }

      this._entitiesByClassName.set(className, target);
    }
  }

  getOrDie<TKind extends EntityKind>(className: string) {
    const entity = this._entitiesByClassName.get(className) as EntityByKind[TKind] | undefined;
    if (!entity) {
      throw new Error(`Expected ${entity} to be registered for output`);
    }
    return entity;
  }

  getAllByKind<TKind extends EntityKind>(kind: TKind): Record<string, EntityByKind[TKind]> {
    const entries = this._entitiesByKind.get(kind)!
      .map((entity) => [entity.slug, entity as EntityByKind[TKind]] as const)
      .sort((a, b) => a[0].localeCompare(b[0]));
    
    return Object.fromEntries(entries);
  }

  getIndexable(): Indexable[] {
    const indexable = [] as Indexable[];
    for (const entities of this._entitiesByKind.values()) {
      for (const { kind, slug, name, icon, categories } of entities) {
        indexable.push({ kind, slug, name, icon, categories });
      }
    }

    return indexable.sort((a, b) => a.slug.localeCompare(b.slug));
  }

  slugForEntityOrDie(className: string): Slug {
    // Lazy evaluation.
    return new SlugReference(this, className) as any;
  }

  _assignBySlug(entityWithoutSlug: WithoutSlug<Entity>, slugPrefix?: string): asserts entityWithoutSlug is Entity {
    // Trust us, we'll set the slug in this function.
    const entity = entityWithoutSlug as Entity;
    const baseSlug = `${slugPrefix || ''}${_baseSlug(entityWithoutSlug)}`;

    let entityArray = this._entitiesByBaseSlug.get(baseSlug);
    if (!entityArray) {
      entityArray = [];
      this._entitiesByBaseSlug.set(baseSlug, entityArray);
    }
    entityArray.push(entity);
    
    if (entityArray.length === 1) {
      entity.slug = baseSlug;
    } else {
      entity.slug = `${baseSlug}-${entityArray.length}`;
    }

    // If we were previously only one, we need to fix the first entity.
    if (entityArray.length === 2) {
      entityArray[0].slug = `${baseSlug}-1`;
    }
  }

  _assignByClassName(entity: Entity, className: string) {
    if (this._entitiesByClassName.has(className)) {
      throw new Error(`Entity conflict: multiple assigned to ${className}`);
    }
    this._entitiesByClassName.set(className, entity);
  }

  _assignByKind(entity: Entity) {
    if (!this._entitiesByKind.has(entity.kind)) this._entitiesByKind.set(entity.kind, []);
    this._entitiesByKind.get(entity.kind)!.push(entity);
  }

  toJSON() {
    return {
      _entitiesByClassName: Array.from(this._entitiesByClassName.keys()),
      _entitiesByBaseSlug: Array.from(this._entitiesByBaseSlug.keys()),
      _entitiesByKind: Array.from(this._entitiesByKind.keys()),
    };
  }
}

function _baseSlug(entity: WithoutSlug<Entity>) {
  return paramCase(entity.name.replace(/[.]/g, ''));
}

export class SlugReference {
  constructor(private _outputDb: OutputDatabase, private _className: string) {}

  toJSON() {
    const className = normalizeClassName(this._className);
    if (!this._outputDb._entitiesByClassName.has(className)) {
      console.warn(`${className} has not been registered`);
      return `--BAD REFERENCE: ${className}--`;
    }
    return this._outputDb._entitiesByClassName.get(className)!.slug;
  }
}
