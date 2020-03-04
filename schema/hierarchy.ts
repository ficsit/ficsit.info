import { Building } from './Building';
import { Item } from './Item';
import { Recipe } from './Recipe';
import { Schematic } from './Schematic';

/**
 * Full details of any entity.
 */
export type AnyEntity = Building | Item | Recipe | Schematic;

export type EntityByKind = {
  [TKind in AnyEntity['kind']]: Extract<AnyEntity, { kind: TKind }>;
}
