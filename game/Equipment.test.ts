import { EquipmentSchema } from './Equipment';

describe(`schema.Equipment`, () => {
  it(`parses Equip_JumpingStilts_C from v114480`, () => {
    const result = EquipmentSchema.parse({
      ClassName: 'Equip_JumpingStilts_C',
      mSprintSpeedFactor: '1.500000',
      mJumpSpeedFactor: '1.500000',
      mEquipmentSlot: 'ES_BACK',
      mAttachSocket: 'jumpingStilt_lSocket',
      mCostToUse: '',
      mArmAnimation: 'AE_None',
      mBackAnimation: 'BE_None',
      mHasPersistentOwner: 'False',
      mUseDefaultPrimaryFire: 'False',
    });

    expect(result).toStrictEqual({
      ClassName: 'Equip_JumpingStilts_C',
      mArmAnimation: 'AE_None',
      mAttachSocket: 'jumpingStilt_lSocket',
      mBackAnimation: 'BE_None',
      mCostToUse: [],
      mEquipmentSlot: 'ES_BACK',
      mHasPersistentOwner: false,
      mUseDefaultPrimaryFire: false,
    });
  });
});
