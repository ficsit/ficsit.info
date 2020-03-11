import { AnyEntity, Slug, Recipe, Schematic } from '@local/schema';
import { paramCase } from 'param-case';

import { normalizeClassName } from './HeaderDatabase';

export type DataTypes = {
  entity: AnyEntity;
  recipe: Recipe;
  schematic: Schematic;
};
export type DataType = keyof DataTypes;
export type Data = DataTypes[DataType];

export type WithoutSlug<TData extends Data> = Omit<TData, 'slug'>;

/**
 * Database that maintains a set of all entities that should be outputted, and
 * handles references from internal class names to them.
 */
export class OutputDatabase {
  _dataByClassName = new Map<string, Data>();
  _dataByBaseSlug = new Map<string, Data[]>();
  _dataByType = new Map<string, Data[]>();

  register<TType extends DataType>(
    type: TType,
    data: WithoutSlug<DataTypes[TType]>,
    classNames: (string | undefined)[],
    slugPrefix?: string,
  ) {
    this._assignBySlug(data, slugPrefix);
    this._assignByType(type, data);
    for (const className of classNames) {
      if (!className) continue;
      this._assignByClassName(data, className);
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

  getOrDie<TData extends Data>(className: string) {
    const data = this._dataByClassName.get(className) as TData | undefined;
    if (!data) {
      throw new Error(`Expected ${data} to be registered for output`);
    }
    return data;
  }

  getAllByType<TType extends DataType>(type: TType): Record<string, DataTypes[TType]> {
    const entries = this._dataByType
      .get(type)!
      .map(data => [data.slug, data as DataTypes[TType]] as const)
      .sort((a, b) => a[0].localeCompare(b[0]));

    return Object.fromEntries(entries);
  }

  slugOrDie(className: string): SlugReferenceString {
    // Lazy evaluation.
    return new SlugReference(this, className) as any;
  }

  _assignBySlug(dataWithoutSlug: WithoutSlug<Data>, slugPrefix?: string): asserts dataWithoutSlug is Data {
    // Trust us, we'll set the slug in this function.
    const data = dataWithoutSlug as Data;
    const baseSlug = `${slugPrefix || ''}${_baseSlug(dataWithoutSlug)}`;

    let dataArray = this._dataByBaseSlug.get(baseSlug);
    if (!dataArray) {
      dataArray = [];
      this._dataByBaseSlug.set(baseSlug, dataArray);
    }
    dataArray.push(data);

    if (dataArray.length === 1) {
      data.slug = baseSlug;
    } else {
      data.slug = `${baseSlug}-${dataArray.length}`;
    }

    // If we were previously only one, we need to fix the first entry.
    if (dataArray.length === 2) {
      dataArray[0].slug = `${baseSlug}-1`;
    }
  }

  _assignByClassName(data: Data, className: string) {
    if (this._dataByClassName.has(className)) {
      throw new Error(`Data conflict: multiple assigned to ${className}`);
    }
    this._dataByClassName.set(className, data);
  }

  _assignByType(type: DataType, data: Data) {
    if (!this._dataByType.has(type)) this._dataByType.set(type, []);
    this._dataByType.get(type)!.push(data);
  }

  toJSON() {
    return {
      _entitiesByClassName: Array.from(this._dataByClassName.keys()),
      _entitiesByBaseSlug: Array.from(this._dataByBaseSlug.keys()),
      _entitiesByKind: Array.from(this._dataByType.keys()),
    };
  }
}

function _baseSlug(data: WithoutSlug<Data>) {
  return paramCase(data.name.replace(/[.]/g, ''));
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
