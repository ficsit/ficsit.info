import { ItemRate } from './solve';
import { AnyEntity, Item, Building } from '@local/schema';

export function extractionsFromInputs(allEntities: Record<string, AnyEntity>, inputs: ItemRate[]) {
  const results = [];
  for (const { slug, perMinute } of inputs) {
    const item = allEntities[slug] as Item;
    const extractedBy = item?.resource?.extractedBy;
    if (!extractedBy) continue;

    const buildingSlug = extractedBy[extractedBy.length - 1];
    const building = allEntities[buildingSlug] as Building;
    if (!building?.extraction) continue;

    const { cycleTime, itemsPerCycle } = building.extraction;
    const perBuilding = (60 / cycleTime) * itemsPerCycle;

    results.push({
      building: buildingSlug,
      item: slug,
      multiple: perMinute / perBuilding,
    });
  }

  return results;
}
