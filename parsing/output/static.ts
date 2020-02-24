import { EntityKind } from '@local/schema';

import { OutputDatabase } from '../state';

export async function fillStaticEntries(outputDb: OutputDatabase) {
  outputDb.reference('Desc_WorkBench_C', 'BP_WorkBenchComponent_C');
  outputDb.reference('Desc_Workshop_C', 'BP_WorkshopComponent_C');
  
  outputDb.register({
    kind: EntityKind.Item,
    name: 'Build Gun',
  }, ['BP_BuildGun_C']);

  outputDb.register({
    kind: EntityKind.Building,
    name: '--Build_Converter_C--'
  }, ['Build_Converter_C']);
}
