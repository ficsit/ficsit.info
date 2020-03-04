import { OutputDatabase } from '../state';

export async function fillStaticEntries(outputDb: OutputDatabase) {
  outputDb.reference('Desc_WorkBench_C', 'BP_WorkBenchComponent_C');
  outputDb.reference('Desc_Workshop_C', 'BP_WorkshopComponent_C');
}
