import { Building } from './Building';
import { Item } from './Item';
import { Recipe } from './Recipe';
import { Schematic } from './Schematic';

/**
 * Full details of any entity.
 */
export type Entity = Building | Item | Recipe | Schematic;

export type EntityByKind = {
  [TKind in Entity['kind']]: Extract<Entity, { kind: TKind }>;
}
