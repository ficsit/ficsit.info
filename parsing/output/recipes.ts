import { Recipe, EntityKind } from '@local/schema';

import { AssetDatabase, EntityDatabase, OutputDatabase, WithoutSlug } from '../state';

import { mapItemAmount, expandReferences } from './_util';

type BuiltRecipe = WithoutSlug<Recipe>;
type RawInfo = EntityDatabase.Info<'FGRecipe'>;

export async function fillRecipes(outputDb: OutputDatabase, entityDb: EntityDatabase, assetDb: AssetDatabase) {
  for (const raw of entityDb.findByClass('FGRecipe')) {
    const recipe = await _buildRecipe(outputDb, entityDb, assetDb, raw);
    if (!recipe) continue;

    outputDb.register(recipe, [raw.entity.ClassName], 'recipe-');
  }
}

async function _buildRecipe(outputDb: OutputDatabase, entityDb: EntityDatabase, assetDb: AssetDatabase, raw: RawInfo): Promise<BuiltRecipe | undefined> {
  // Is it a raw resource?
  if (raw.entity.mProducedIn.length === 1 
   && raw.entity.mProducedIn[0]?.className === 'Build_Converter_C' 
   && raw.entity.mIngredients.length === 1 
   && raw.entity.mProduct.length === 1 
   && raw.entity.mIngredients[0].ItemClass?.className === raw.entity.mProduct[0].ItemClass?.className) {
    // Make sure we mark the item description appropriately.
    const item = outputDb.getOrDie<EntityKind.Item>(raw.entity.mIngredients[0].ItemClass?.className!);
    item.raw = true;
    // And don't emit a recipe for it.
    return;
  }

  const recipe = {
    kind: EntityKind.Recipe,
    name: raw.entity.mDisplayName,
    ingredients: raw.entity.mIngredients.map(a => mapItemAmount(outputDb, a)),
    products: raw.entity.mProduct.map(a => mapItemAmount(outputDb, a)),
    producedIn: expandReferences(outputDb, entityDb, raw.entity.mProducedIn),
    duration: raw.entity.mManufactoringDuration,
    manualMultiplier: raw.entity.mManualManufacturingMultiplier,
  } as const;

  const firstProduct = entityDb.getOrDie(raw.entity.mProduct[0].ItemClass!.path);
  // TODO: support vehicles
  if (entityDb.isKind<any>(firstProduct, 'FGVehicleDescriptor')) return;

  const icon = await assetDb.findLargestEntityIcon(firstProduct);
  if (icon) {
    const image = await assetDb.saveImage(icon);
    _assign(recipe, 'icon', image);
  }

  // TODO: is there a better way?
  if (raw.entity.mDisplayName.startsWith('Alternate: ')) {
    _assign(recipe, 'alternate', true);
  }

  return recipe;
}

function _assign<TTarget extends object, TKey extends keyof BuiltRecipe, TValue extends BuiltRecipe[TKey]>(
  target: TTarget, key: TKey, value: TValue
): asserts target is TTarget & Record<TKey, TValue> {
  (target as any)[key] = value;
}
