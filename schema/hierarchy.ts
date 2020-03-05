import { Building } from './Building';
import { Item } from './Item';
import { Recipe } from './Recipe';
import { Schematic } from './Schematic';

/**
 * Full details of any data type.
 */
export type AnyData = AnyEntity | Recipe | Schematic;

/**
 * Full details of any entity.
 */
export type AnyEntity = Building | Item;
