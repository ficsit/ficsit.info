import { Building, EntityKind } from '@local/schema';

import { AssetDatabase, EntityDatabase, OutputDatabase, WithoutSlug } from '../state';

import { mapItemForm, expandReferences } from './_util';

type BuiltBuilding = WithoutSlug<Building>;
type RawInfo = EntityDatabase.Info<'FGBuildable'>;
type Descriptor = EntityDatabase.Info<'FGBuildDescriptor'>;

export async function fillBuildings(outputDb: OutputDatabase, entityDb: EntityDatabase, assetDb: AssetDatabase) {
  for (const raw of entityDb.findByClass('FGBuildable')) {
    const descriptor = _findDescriptor(entityDb, raw);
    const building = await _buildBuilding(outputDb, entityDb, assetDb, raw, descriptor);

    outputDb.register(building, [raw.entity.ClassName, descriptor?.entity.ClassName]);
  }
}

function _findDescriptor(entityDb: EntityDatabase, raw: RawInfo) {
  const baseClass = /^[^_]+_(.+)_C$/.exec(raw.entity.ClassName)![1];
  const descriptorClass = `Desc_${baseClass}_C`;
  const descriptor = entityDb.get(descriptorClass); 
  if (!descriptor) {
    console.warn(`Unable to find item descriptor ${descriptorClass} for building ${raw.entity.ClassName}`);
    return;
  }
  if (!entityDb.isKind(descriptor, 'FGBuildDescriptor')) {
    throw new Error(`Expected ${descriptorClass} to be a FGBuildDescriptor`);
  }

  return descriptor;
}

async function _buildBuilding(outputDb: OutputDatabase, entityDb: EntityDatabase, assetDb: AssetDatabase, raw: RawInfo, descriptor?: Descriptor): Promise<BuiltBuilding> {
  const building = {
    kind: EntityKind.Building,
    name: raw.entity.mDisplayName,
    description: raw.entity.mDescription,
    categories: _extractCategories(descriptor),
  } as const;

  const icon = await assetDb.findLargestEntityIcon(descriptor || raw);
  if (icon) {
    const image= await assetDb.saveImage(icon);
    _assign(building, 'icon', image);
  }

  if (entityDb.isKind(raw, 'FGBuildableFactory')) {
    if (raw.entity.mCanChangePotential) {
      _assign(building, 'overclockable', true);
    }

    if (raw.entity.mPowerConsumption) {
      _assign(building, 'powerConsumption', {
        amount: raw.entity.mPowerConsumption,
        exponent: raw.entity.mPowerConsumptionExponent,
      })
    }
  }

  if (entityDb.isKind(raw, 'FGBuildableGenerator')) {
    const fuelItems = [];
    for (const fuelClass of (raw.entity.mDefaultFuelClasses || [])) {
      if (!fuelClass) continue;

      const match = /\/FactoryGame\.(FG.+)$/.exec(fuelClass.path);
      // Is it an entire class?
      if (match) {
        for (const item of entityDb.findByClass(match[1])) {
          fuelItems.push(item);
        }
      } else {
        // Is it a single entity?
        const fuel = entityDb.getOrDie(fuelClass.path);
        fuelItems.push(fuel);
      }
    }

    _assign(building, 'powerProduction', {
      amount: raw.entity.mPowerProduction,
      exponent: raw.entity.mPowerProductionExponent,
      fuelForm: raw.entity.mFuelResourceForm ? mapItemForm(raw.entity.mFuelResourceForm) : undefined,
      fuels: expandReferences(outputDb, entityDb, raw.entity.mDefaultFuelClasses),
    })
  }

  if (entityDb.isKind(raw, 'FGBuildableStorage')) {
    _assign(building, 'storage', {
      x: raw.entity.mInventorySizeX,
      y: raw.entity.mInventorySizeY,
    });
  }

  if (entityDb.isKind(raw, 'FGBuildableConveyorBase')) {
    _assign(building, 'conveyor', {
      speed: raw.entity.mSpeed,
    });
  }

  return building;
}

function _extractCategories(descriptor?: Descriptor) {
  if (!descriptor) return;
  const categories = descriptor.entity.mSubCategories;
  if (categories.length > 1) {
    console.warn(`build descriptor had more than one category!? ${JSON.stringify(categories)}`);
  }

  const match = /\/Sub_([^\/]+)\/SC_([^.]+)\./.exec(categories[0]!.path);
  if (!match) {
    console.warn(`Unable to extract categories from ${categories[0]!.path}`);
    return;
  }

  // TODO: Manual cleanup.
  return [match[1], match[2]];
}

function _assign<TTarget extends object, TKey extends keyof BuiltBuilding, TValue extends BuiltBuilding[TKey]>(
  target: TTarget, key: TKey, value: TValue
): asserts target is TTarget & Record<TKey, TValue> {
  (target as any)[key] = value;
}
