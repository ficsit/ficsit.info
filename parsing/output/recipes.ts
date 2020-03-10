import { Recipe } from '@local/schema';

import { EntityDatabase, OutputDatabase, WithoutSlug } from '../state';

import { mapItemAmount, expandReferences } from './_util';

const playerPlacingEntities = new Set(['BP_BuildGun_C']);

const handcraftingEntities = new Set([
  'BP_WorkBenchComponent_C',
  'BP_WorkshopComponent_C',
  'Build_AutomatedWorkBench_C',
]);

type BuiltRecipe = WithoutSlug<Recipe>;
type RawInfo = EntityDatabase.Info<'FGRecipe'>;

export async function fillRecipes(
  outputDb: OutputDatabase,
  entityDb: EntityDatabase,
) {
  for (const raw of entityDb.findByClass('FGRecipe')) {
    const recipe = await _buildRecipe(outputDb, entityDb, raw);
    if (!recipe) continue;

    outputDb.register('recipe', recipe, [raw.entity.ClassName], 'recipe-');
  }
}

async function _buildRecipe(
  outputDb: OutputDatabase,
  entityDb: EntityDatabase,
  raw: RawInfo,
): Promise<BuiltRecipe | undefined> {
  // Is it a raw resource? Don't emit it.
  if (isResourceSource(raw)) return;

  let placedByPlayer: undefined | true = undefined;
  const producedIn = [] as string[];
  const handcraftedIn = [] as string[];
  for (const building of expandReferences(
    outputDb,
    entityDb,
    raw.entity.mProducedIn,
  )) {
    if (handcraftingEntities.has(building.className)) {
      handcraftedIn.push(building);
    } else if (playerPlacingEntities.has(building.className)) {
      placedByPlayer = true;
    } else {
      producedIn.push(building);
    }
  }

  if (producedIn.length > 1) {
    throw new Error(`wat: ${JSON.stringify(producedIn)}`);
  }

  const recipe = {
    name: raw.entity.mDisplayName,
    ingredients: raw.entity.mIngredients.map(a =>
      mapItemAmount(outputDb, entityDb, a),
    ),
    products: raw.entity.mProduct.map(a =>
      mapItemAmount(outputDb, entityDb, a),
    ),
    producedIn,
    handcraftedIn,
    placedByPlayer,
    duration: raw.entity.mManufactoringDuration,
    manualMultiplier: raw.entity.mManualManufacturingMultiplier,
  } as const;

  const firstProduct = entityDb.getOrDie(
    raw.entity.mProduct[0].ItemClass!.path,
  );
  // TODO: support vehicles
  if (entityDb.isKind<any>(firstProduct, 'FGVehicleDescriptor')) return;

  // TODO: is there a better way?
  if (raw.entity.mDisplayName.startsWith('Alternate: ')) {
    _assign(recipe, 'alternate', true);
  }

  return recipe;
}

function _assign<
  TTarget extends object,
  TKey extends keyof BuiltRecipe,
  TValue extends BuiltRecipe[TKey]
>(
  target: TTarget,
  key: TKey,
  value: TValue,
): asserts target is TTarget & Record<TKey, TValue> {
  (target as any)[key] = value;
}

export function isResourceSource({
  entity: { mProducedIn, mIngredients, mProduct },
}: RawInfo) {
  return (
    mProducedIn.length === 1 &&
    mProducedIn[0]?.className === 'Build_Converter_C' &&
    mIngredients.length === 1 &&
    mProduct.length === 1 &&
    mIngredients[0].ItemClass?.className === mProduct[0].ItemClass?.className
  );
}
