import * as game from '@local/game';

import { FileSystem } from './FileSystem';
import { HeaderDatabase, normalizeClassName } from './HeaderDatabase';

type AllSchema = typeof game[keyof typeof game];
type ClassSchema = Extract<AllSchema, { className: string }>;
type ClassSchemaByName = {
  [TName in ClassSchema['className']]: Extract<
    ClassSchema,
    { className: TName }
  >;
};

const schemaByClass = {} as Record<string, ClassSchema>;
for (const specificSchema of Object.values(game)) {
  if ('className' in specificSchema) {
    schemaByClass[specificSchema.className] = specificSchema;
  }
}

type Docs = {
  NativeClass: string;
  Classes: any[];
}[];

/**
 * A container for entity metadata (as described by Docs.json), indexed in
 * various ways to aid transformation into more usable forms for the web front
 * end.
 */
export class EntityDatabase {
  _entities = {} as Record<string, EntityDatabase.Info>;

  constructor(
    private readonly _fs: FileSystem,
    private readonly _headers: HeaderDatabase,
  ) {}

  async load() {
    const docsData = await this._fs.read('Docs.json');
    const docs = JSON.parse(docsData) as Docs;

    for (const { NativeClass, Classes } of docs) {
      const className = normalizeClassName(NativeClass);
      const schema = this._headers.findAncestor(
        className,
        n => schemaByClass[n],
      );
      if (!schema) {
        console.warn(`Unable to find a matching schema for ${className}`);
        continue;
      }

      for (const rawEntity of Classes) {
        const info = {
          kind: schema.className,
          className,
          entity: schema.parse(rawEntity),
          inbound: [],
          outbound: [],
        };

        if (info.entity.ClassName in this._entities) {
          throw new Error(`Duplicate entity: ${info.entity.ClassName}`);
        }
        this._entities[info.entity.ClassName] = info;
      }
    }

    for (const info of Object.values(this._entities)) {
      info.outbound = this._findReferences(info.entity);
      for (const entityReference of info.outbound) {
        const target = this.get(entityReference.className);
        if (!target) {
          console.warn(
            `Missing reference target: ${entityReference.className}`,
          );
          continue;
        }
        target.inbound.push({
          path: entityReference.path,
          className: info.entity.ClassName,
          reference: entityReference.reference,
        });
      }
    }
  }

  get<TClass extends string = string>(
    instanceName: string,
  ): EntityDatabase.Info<TClass> | undefined {
    instanceName = normalizeClassName(instanceName);
    return this._entities[instanceName] as any;
  }

  getOrDie<TKind extends ClassSchema['className']>(
    instanceName: string,
    kind?: TKind,
  ): EntityDatabase.Info<TKind> {
    instanceName = normalizeClassName(instanceName);
    const entity = this._entities[instanceName];
    if (!entity) {
      throw new Error(`Unknown entity: ${instanceName}`);
    }
    if (kind && !this.isKind(entity, kind)) {
      throw new Error(`Expected ${instanceName} to be a ${kind}`);
    }

    return entity;
  }

  *findByClass<TClass extends string>(
    className: TClass,
  ): Generator<EntityDatabase.Info<TClass>> {
    for (const entity of Object.values(this._entities)) {
      if (this._headers.findAncestor(entity.className, n => n === className)) {
        yield entity as any;
      }
    }
  }

  findInboundByClass<TClass extends string>(
    instanceName: string,
    targetClass: TClass,
  ): EntityDatabase.Info<TClass>[] {
    const inbound = [] as EntityDatabase.Info<TClass>[];

    this.getOrDie(instanceName).inbound.filter(({ className }) => {
      const inboundEntity = this.getOrDie(className);
      if (
        this._headers.findAncestor(
          inboundEntity.className,
          n => n === targetClass,
        )
      ) {
        inbound.push(inboundEntity as any);
      }
    });

    return inbound;
  }

  isKind<TKind extends ClassSchema['className']>(
    info: EntityDatabase.Info,
    kind: TKind,
  ): info is EntityDatabase.Info<TKind> {
    return !!this._headers.findAncestor(info.className, n => n === kind);
  }

  toJSON() {
    return this._entities;
  }

  _findReferences(
    value: any,
    path: (number | string)[] = [],
  ): EntityDatabase.EntityReference[] {
    if (value instanceof game.Reference) {
      return [
        { path, className: normalizeClassName(value.path), reference: value },
      ];
    } else if (Array.isArray(value)) {
      return value.flatMap((v, i) => this._findReferences(v, [...path, i]));
    } else if (typeof value === 'object' && value !== null) {
      const references = [] as EntityDatabase.EntityReference[];
      for (const [key, child] of Object.entries(value)) {
        references.push(...this._findReferences(child, [...path, key]));
      }
      return references;
    } else {
      return [];
    }
  }
}

export namespace EntityDatabase {
  export interface EntityReference {
    path: (string | number)[];
    className: string;
    reference: game.Reference;
  }

  export interface Info<TKind extends string = ClassSchema['className']> {
    kind: ClassSchema['className'];
    className: string;
    entity: TKind extends ClassSchema['className']
      ? game.DeclarationShape<ClassSchemaByName[TKind]>
      : game.DeclarationShape<ClassSchema>;
    inbound: EntityReference[];
    outbound: EntityReference[];
  }
}
