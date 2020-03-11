import { Item, EntityKind, ItemResourceDetails } from '@local/schema';
import * as game from '@local/game';

import { AssetDatabase, EntityDatabase, OutputDatabase, WithoutSlug } from '../state';

import { mapItemForm, mapEquipmentSlot, mapStackSize, itemsExtractedBy } from './_util';
import { isResourceSource } from './recipes';

type BuiltItem = WithoutSlug<Item>;
type RawInfo = EntityDatabase.Info<'FGItemDescriptor'>;

export async function fillItems(outputDb: OutputDatabase, entityDb: EntityDatabase, assetDb: AssetDatabase) {
  for (const raw of entityDb.findByClass('FGItemDescriptor')) {
    if (entityDb.isKind(raw, 'FGBuildDescriptor')) continue;

    const item = await _buildItem(entityDb, assetDb, raw);
    outputDb.register('entity', item, [raw.entity.ClassName]);
  }

  for (const raw of entityDb.findByClass('FGBuildableResourceExtractor')) {
    const items = itemsExtractedBy(raw, entityDb);
    const extractorSlug = outputDb.slugOrDie(raw.entity.ClassName);
    for (const className of items) {
      const item = outputDb.getOrDie<Item>(className);
      if (!item.resource) item.resource = {};
      if (!item.resource.extractedBy) item.resource.extractedBy = [];
      item.resource.extractedBy.push(extractorSlug);
    }
  }
}

async function _buildItem(
  entityDb: EntityDatabase,
  assetDb: AssetDatabase,
  raw: RawInfo,
): Promise<BuiltItem> {
  const item = {
    kind: EntityKind.Item,
    name: raw.entity.mDisplayName,
    description: raw.entity.mDescription,
    form: mapItemForm(raw.entity.mForm),
  } as const;

  const icon = await assetDb.findLargestEntityIcon(raw);
  if (icon) {
    const image = await assetDb.saveEntityIcon(icon, EntityKind.Item);
    _assign(item, 'icon', image);
  }

  if (raw.entity.mStackSize === 'SS_FLUID') {
    _assign(item, 'fluid', {
      color: _toColor(raw.entity.mFluidColor),
    });
  } else {
    _assign(item, 'stackSize', mapStackSize(raw.entity.mStackSize));
  }

  if (raw.entity.mRadioactiveDecay) {
    _assign(item, 'radioactivity', {
      decay: raw.entity.mRadioactiveDecay,
    });
  }

  if (raw.entity.mEnergyValue) {
    let energy = raw.entity.mEnergyValue;
    if (raw.entity.mForm === 'RF_LIQUID') {
      energy *= 1e3;
    }
    _assign(item, 'fuel', { energy });
  }

  const baseName = /^[^_]+_(.+)_C$/.exec(raw.entity.ClassName)![1].replace('EquipmentDescriptor', '');
  const equipment = entityDb.get<'FGEquipment'>(`Equip_${baseName}_C`);
  if (equipment) {
    let cost;
    if (equipment.entity.mCostToUse) {
      cost = equipment.entity.mCostToUse.map(({ ItemClass, Amount }) => ({
        item: ItemClass!.path,
        count: Amount,
      }));
    }

    _assign(item, 'equipment', {
      slot: mapEquipmentSlot(equipment.entity.mEquipmentSlot),
      cost,
    });
  }

  // TODO: Post pass.
  const recipes = entityDb.findInboundByClass(raw.entity.ClassName, 'FGRecipe');
  const isProduced = recipes.some(({ entity: { mProduct } }) => {
    return mProduct.some(({ ItemClass }) => ItemClass?.className === raw.entity.ClassName);
  });
  const IsMined = recipes.some(rawRecipe => {
    if (!isResourceSource(rawRecipe)) return false;
    return rawRecipe.entity.mProduct[0].ItemClass?.className === raw.entity.ClassName;
  });

  if (!isProduced || raw.entity.ClassName === 'Desc_Water_C') {
    _assign(item, 'resource', {} as ItemResourceDetails);
    if (!isProduced) {
      item.resource.gatherable = true;
    }
  }

  if (raw.entity.mStackSize === 'SS_FLUID') {
    _assign(item, 'categories', ['Fluids']);
  } else if (IsMined) {
    _assign(item, 'categories', ['Ores']);
  } else if (!isProduced) {
    _assign(item, 'categories', ['Gathered']);
  } else if (equipment) {
    _assign(item, 'categories', ['Equipment']);
  } else {
    _assign(item, 'categories', ['Parts']);
  }

  return item;
}

function _toColor(color: game.Color) {
  return `#${color.R.toString(16)}${color.G.toString(16)}${color.B.toString(16)}${color.A.toString(16)}`;
}

function _assign<TTarget extends object, TKey extends keyof BuiltItem, TValue extends BuiltItem[TKey]>(
  target: TTarget,
  key: TKey,
  value: TValue,
): asserts target is TTarget & Record<TKey, TValue> {
  (target as any)[key] = value;
}
