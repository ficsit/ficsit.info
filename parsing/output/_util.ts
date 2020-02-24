import { ItemForm, ItemStackSize, EquipmentSlot, SchematicKind } from '@local/schema';
import { ItemAmount, Reference } from '@local/game';

import { EntityDatabase, OutputDatabase } from '../state';

export function enumMapper<TValues>(description: string, mapping: Record<any, TValues>) {
  return function mapEnum(sourceValue: any) {
    if (!(sourceValue in mapping)) {
      throw new Error(`Unable to convert ${description}. Unknown source value: ${sourceValue}`);
    }
    return mapping[sourceValue];
  }
}

export const mapItemForm = enumMapper('ItemForm', {
  RF_SOLID: ItemForm.Solid,
  RF_LIQUID: ItemForm.Liquid,
  RF_GAS: ItemForm.Gas,
  RF_HEAT: ItemForm.Heat,
});

export const mapStackSize = enumMapper('ItemStackSize', {
  SS_ONE: ItemStackSize.One,
  SS_SMALL: ItemStackSize.Small,
  SS_MEDIUM: ItemStackSize.Medium,
  SS_BIG: ItemStackSize.Big,
  SS_HUGE: ItemStackSize.Huge,
});

export const mapEquipmentSlot = enumMapper('EquipmentSlot', {
  ES_ARMS: EquipmentSlot.Arms,
  ES_BACK: EquipmentSlot.Body,
});

export const mapSchematicKind = enumMapper('SchematicKind', {
  EST_Custom: SchematicKind.Custom,
  EST_Tutorial: SchematicKind.Tutorial,
  EST_Alternate: SchematicKind.Alternate,
  EST_MAM: SchematicKind.MAM,
  EST_HardDrive: SchematicKind.HardDrive,
  EST_Milestone: SchematicKind.Milestone,
  EST_ResourceSink: SchematicKind.ResourceSink,
})

export function expandReferences(outputDb: OutputDatabase, entityDb: EntityDatabase, references: (Reference | undefined)[]): string[]
export function expandReferences(outputDb: OutputDatabase, entityDb: EntityDatabase, references?: (Reference | undefined)[]): undefined | string[]
export function expandReferences(outputDb: OutputDatabase, entityDb: EntityDatabase, references?: (Reference | undefined)[]) {
  if (!references) return;

  const classNames = new Set<string>();
  for (const reference of references) {
    if (!reference) continue;

    const match = /\/FactoryGame\.(FG.+)$/.exec(reference.path);
    // Is it an entire class?
    if (match) {
      for (const { entity } of entityDb.findByClass(match[1])) {
        classNames.add(entity.ClassName);
      }
    } else {
      classNames.add(reference.path)
    }
  }

  return Array.from(classNames.values()).map(c => outputDb.slugForEntityOrDie(c));
}

export function mapItemAmount(outputDb: OutputDatabase, itemAmount: ItemAmount) {
  return {
    item: outputDb.slugForEntityOrDie(itemAmount.ItemClass!.path),
    count: itemAmount.Amount,
  }
}
