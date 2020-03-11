import { EntityKind, ItemForm, Item } from '@local/schema';

import { OutputDatabase, AssetDatabase } from '../state';

export async function fillStaticEntries(outputDb: OutputDatabase, assetDb: AssetDatabase) {
  // Wat.
  outputDb.register(
    'entity',
    {
      kind: EntityKind.Item,
      name: `Hard Drive`,
      description: `A hard drive with Ficsit data. Analyze it in the M.A.M. to salvage its contents.`,
      icon: await assetDb.saveEntityIcon(
        'Resource/Environment/CrashSites/UI/HardDrive_256.png',
        EntityKind.Item,
      ),
      categories: ['Gathered'],
      form: ItemForm.Solid,
      resource: {
        gatherable: true,
      },
    } as Item,
    ['Desc_HardDrive_C'],
  );

  outputDb.register(
    'entity',
    {
      kind: EntityKind.Item,
      name: `FicsIt Coupon`,
      description: `A special FicsIt bonus program Coupon, obtained through the AWESOME Sink. Can be redeemed in the AWESOME Shop for bonus milestones and rewards.`,
      icon: await assetDb.saveEntityIcon(
        'Resource/Parts/ResourceSinkCoupon/UI/Ficsit_Coupon_256.png',
        EntityKind.Item,
      ),
      categories: ['Gathered'],
      form: ItemForm.Solid,
      resource: {
        gatherable: true,
      },
    } as Item,
    ['Desc_ResourceSinkCoupon_C'],
  );

  outputDb.reference('Desc_WorkBench_C', 'BP_WorkBenchComponent_C');
  outputDb.reference('Desc_Workshop_C', 'BP_WorkshopComponent_C');
}
