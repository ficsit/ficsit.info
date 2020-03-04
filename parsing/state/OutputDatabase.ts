import { paramCase } from 'param-case';
import { AnyEntity, EntityKind, EntityByKind, Slug, Entity, Recipe, Schematic } from '@local/schema';

import { normalizeClassName } from './HeaderDatabase';

export type DataTypes = {
  entity: AnyEntity;
  recipe: Recipe;
  schematic: Schematic;
};
export type DataType = keyof DataTypes;
export type Data = DataTypes[DataType];

export type WithoutSlug<TEntity extends AnyEntity> = Omit<TEntity, 'slug'>;

/**
 * Database that maintains a set of all entities that should be outputted, and 
 * handles references from internal class names to them.
 */
export class OutputDatabase {
  _dataByClassName = new Map<string, AnyEntity>();
  _dataByBaseSlug = new Map<string, AnyEntity[]>();
  _dataByKind = new Map<string, AnyEntity[]>();

  register(entity: WithoutSlug<AnyEntity>, classNames: (string | undefined)[], slugPrefix?: string) {
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
      if (this._dataByClassName.get(className)) {
        throw new Error(`Refusing to overwrite ${className} with a reference to ${targetClassName}`);
      }

      this._dataByClassName.set(className, target);
    }
  }

  getOrDie<TKind extends EntityKind>(className: string) {
    const entity = this._dataByClassName.get(className) as EntityByKind[TKind] | undefined;
    if (!entity) {
      throw new Error(`Expected ${entity} to be registered for output`);
    }
    return entity;
  }

  getAllByType<TType extends DataType>(type: TType): Record<string, DataTypes[TType]> {
    if (type === 'entity') {
      const entries = [
        ...Object.entries(this.getAllByKind(EntityKind.Building)),
        ...Object.entries(this.getAllByKind(EntityKind.Item)),
      ];
      const sorted = entries.sort((a, b) => a[0].localeCompare(b[0]));
      return Object.fromEntries(sorted);
    } else {
      return this.getAllByKind(type as any);
    }
  }

  getAllByKind<TKind extends EntityKind>(kind: TKind): Record<string, EntityByKind[TKind]> {
    const entries = this._dataByKind.get(kind)!
      .map((entity) => [entity.slug, entity as EntityByKind[TKind]] as const)
      .sort((a, b) => a[0].localeCompare(b[0]));
    
    return Object.fromEntries(entries);
  }

  getIndexable(): Entity[] {
    const indexable = [] as Entity[];
    for (const entities of this._dataByKind.values()) {
      for (const { kind, slug, name, icon, categories } of entities) {
        indexable.push({ kind, slug, name, icon, categories });
      }
    }

    return indexable.sort((a, b) => a.slug.localeCompare(b.slug));
  }

  slugForEntityOrDie(className: string): SlugReferenceString {
    // Lazy evaluation.
    return new SlugReference(this, className) as any;
  }

  _assignBySlug(entityWithoutSlug: WithoutSlug<AnyEntity>, slugPrefix?: string): asserts entityWithoutSlug is AnyEntity {
    // Trust us, we'll set the slug in this function.
    const entity = entityWithoutSlug as AnyEntity;
    const baseSlug = `${slugPrefix || ''}${_baseSlug(entityWithoutSlug)}`;

    let entityArray = this._dataByBaseSlug.get(baseSlug);
    if (!entityArray) {
      entityArray = [];
      this._dataByBaseSlug.set(baseSlug, entityArray);
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

  _assignByClassName(entity: AnyEntity, className: string) {
    if (this._dataByClassName.has(className)) {
      throw new Error(`Entity conflict: multiple assigned to ${className}`);
    }
    this._dataByClassName.set(className, entity);
  }

  _assignByKind(entity: AnyEntity) {
    if (!this._dataByKind.has(entity.kind)) this._dataByKind.set(entity.kind, []);
    this._dataByKind.get(entity.kind)!.push(entity);
  }

  toJSON() {
    return {
      _entitiesByClassName: Array.from(this._dataByClassName.keys()),
      _entitiesByBaseSlug: Array.from(this._dataByBaseSlug.keys()),
      _entitiesByKind: Array.from(this._dataByKind.keys()),
    };
  }
}

function _baseSlug(entity: WithoutSlug<AnyEntity>) {
  return paramCase(entity.name.replace(/[.]/g, ''));
}

export type SlugReferenceString = Slug & { className: string };

export class SlugReference {
  public className: string;
  constructor(private _outputDb: OutputDatabase, _className: string) {
    this.className = normalizeClassName(_className);
  }

  toJSON() {
    if (!this._outputDb._dataByClassName.has(this.className)) {
      console.warn(`${this.className} has not been registered`);
      return `--BAD REFERENCE: ${this.className}--`;
    }
    return this._outputDb._dataByClassName.get(this.className)!.slug;
  }
}
