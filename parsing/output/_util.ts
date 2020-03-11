import { ItemForm, EquipmentSlot, SchematicKind } from '@local/schema';
import { ItemAmount, Reference } from '@local/game';

import { EntityDatabase, OutputDatabase, SlugReferenceString } from '../state';

export function enumMapper<TValues>(description: string, mapping: Record<any, TValues>) {
  return function mapEnum(sourceValue: any) {
    if (!(sourceValue in mapping)) {
      throw new Error(`Unable to convert ${description}. Unknown source value: ${sourceValue}`);
    }
    return mapping[sourceValue];
  };
}

export const mapItemForm = enumMapper('ItemForm', {
  RF_SOLID: ItemForm.Solid,
  RF_LIQUID: ItemForm.Liquid,
  RF_GAS: ItemForm.Gas,
  RF_HEAT: ItemForm.Heat,
});

export const mapStackSize = enumMapper('ItemStackSize', {
  SS_ONE: 1,
  SS_SMALL: 50,
  SS_MEDIUM: 100,
  SS_BIG: 200,
  SS_HUGE: 500,
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
});

export function expandReferences(
  outputDb: OutputDatabase,
  entityDb: EntityDatabase,
  references: (Reference | undefined)[],
): SlugReferenceString[];
export function expandReferences(
  outputDb: OutputDatabase,
  entityDb: EntityDatabase,
  references?: (Reference | undefined)[],
): undefined | SlugReferenceString[];
export function expandReferences(
  outputDb: OutputDatabase,
  entityDb: EntityDatabase,
  references?: (Reference | undefined)[],
) {
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
      classNames.add(reference.path);
    }
  }

  return Array.from(classNames.values()).map(c => outputDb.slugOrDie(c));
}

export function mapItemAmount(outputDb: OutputDatabase, entityDb: EntityDatabase, itemAmount: ItemAmount) {
  const classPath = itemAmount.ItemClass!.path;
  const item = entityDb.get<'FGItemDescriptor'>(classPath);
  let count = itemAmount.Amount;
  if (item?.entity?.mForm === 'RF_LIQUID') {
    count /= 1e3;
  }

  return {
    count,
    item: outputDb.slugOrDie(classPath),
  };
}

export function itemsExtractedBy(
  { entity }: EntityDatabase.Info<'FGBuildableResourceExtractor'>,
  entityDb: EntityDatabase,
) {
  const items = [];
  for (const resource of entity.mAllowedResources) {
    if (!resource) continue;
    items.push(resource.className);
  }

  for (const pair of entity.mParticleMap || []) {
    const resourceRef = pair.ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3;
    if (!resourceRef?.className) continue;
    const resource = entityDb.get<'FGItemDescriptor'>(resourceRef?.className);
    if (!resource) continue;
    if (!entity.mAllowedResourceForms.includes(resource.entity.mForm)) continue;
    items.push(resource.entity.ClassName);
  }

  return items;
}
