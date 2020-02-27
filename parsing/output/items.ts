import { Item, EntityKind } from '@local/schema';
import * as game from '@local/game';

import { AssetDatabase, EntityDatabase, OutputDatabase, WithoutSlug } from '../state';

import { mapItemForm, mapEquipmentSlot, mapStackSize } from './_util';

type BuiltItem = WithoutSlug<Item>;
type RawInfo = EntityDatabase.Info<'FGItemDescriptor'>;

export async function fillItems(outputDb: OutputDatabase, entityDb: EntityDatabase, assetDb: AssetDatabase) {
  for (const raw of entityDb.findByClass('FGItemDescriptor')) {
    if (entityDb.isKind(raw, 'FGBuildDescriptor')) continue;

    const item = await _buildItem(entityDb, assetDb, raw);

    outputDb.register(item, [raw.entity.ClassName]);
  }
}

async function _buildItem(entityDb: EntityDatabase, assetDb: AssetDatabase, raw: RawInfo): Promise<BuiltItem> {
  const item = {
    kind: EntityKind.Item,
    name: raw.entity.mDisplayName,
    description: raw.entity.mDescription,
    form: mapItemForm(raw.entity.mForm),
  } as const;

  const icon = await assetDb.findLargestEntityIcon(raw, raw.entity.mDisplayName);
  if (icon) {
    const image = await assetDb.saveImage(icon);
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
    _assign(item, 'fuel', {
      energy: raw.entity.mEnergyValue,
    });
  }

  const baseName = /^[^_]+_(.+)_C$/.exec(raw.entity.ClassName)![1];
  const equipment = entityDb.get<'FGEquipment'>(`Equip_${baseName}_C`);
  if (equipment)  {
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

  return item;
}

function _toColor(color: game.Color) {
  return `#${color.R.toString(16)}${color.G.toString(16)}${color.B.toString(16)}${color.A.toString(16)}`;
}

function _assign<TTarget extends object, TKey extends keyof BuiltItem, TValue extends BuiltItem[TKey]>(
  target: TTarget, key: TKey, value: TValue
): asserts target is TTarget & Record<TKey, TValue> {
  (target as any)[key] = value;
}
