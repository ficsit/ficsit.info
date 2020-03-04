import { Schematic, EntityKind } from '@local/schema';

import { EntityDatabase, OutputDatabase, WithoutSlug } from '../state';

import { mapItemAmount, expandReferences, mapSchematicKind } from './_util';

type BuiltSchematic = WithoutSlug<Schematic>;
type RawInfo = EntityDatabase.Info<'FGSchematic'>;

export async function fillSchematics(outputDb: OutputDatabase, entityDb: EntityDatabase) {
  for (const raw of entityDb.findByClass('FGSchematic')) {
    const schematic = await _buildSchematic(outputDb, entityDb, raw);
    if (!schematic) continue;

    outputDb.register('schematic', schematic, [raw.entity.ClassName], 'schematic-');
  }
}

async function _buildSchematic(outputDb: OutputDatabase, entityDb: EntityDatabase, raw: RawInfo): Promise<BuiltSchematic | undefined> {
  const schematic = {
    kind: EntityKind.Schematic,
    schematicKind: mapSchematicKind(raw.entity.mType),
    name: raw.entity.mDisplayName,
    cost: raw.entity.mCost.map(a => mapItemAmount(outputDb, a)),
    unlocks: expandReferences(outputDb, entityDb, raw.entity.mUnlocks),
    tier: raw.entity.mTechTier,
    dependencies: expandReferences(outputDb, entityDb, raw.entity.mAdditionalSchematicDependencies),
    shipTravelTime: raw.entity.mTimeToComplete,
  } as const;

  return schematic;
}
