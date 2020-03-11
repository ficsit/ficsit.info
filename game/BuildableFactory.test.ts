import { BuildableFactorySchema } from './BuildableFactory';

describe(`schema.BuildableFactory`, () => {
  it(`parses Build_ManufacturerMk1_C from v114480`, () => {
    const result = BuildableFactorySchema.parse({
      ClassName: 'Build_ManufacturerMk1_C',
      mCurrentRecipeChanged: '()',
      mManufacturingSpeed: '1.000000',
      mFactoryInputConnections: '',
      mPipeInputConnections: '',
      mFactoryOutputConnections: '',
      mPipeOutputConnections: '',
      mPowerConsumption: '55.000000',
      mPowerConsumptionExponent: '1.600000',
      mOnHasPowerChanged: '()',
      mOnHasProductionChanged: '()',
      mMinimumProducingTime: '2.000000',
      mMinimumStoppedTime: '5.000000',
      mNumCyclesForProductivity: '20',
      mCanChangePotential: 'True',
      mMinPotential: '0.010000',
      mMaxPotential: '1.000000',
      mMaxPotentialIncreasePerCrystal: '0.500000',
      mFluidStackSizeDefault: 'SS_FLUID',
      mFluidStackSizeMultiplier: '1',
      OnReplicationDetailActorCreatedEvent: '()',
      mSignificanceBias: '0.000000',
      mEffectUpdateInterval: '0.000000',
      mAddToSignificanceManager: 'True',
      mSignificanceRange: '18000.000000',
      mDisplayName: 'Manufacturer',
      mDescription:
        'Crafts three or four parts into another part.\r\n\r\nCan be automated by feeding parts into it with a conveyor belt connected to the input. The produced parts can be automatically extracted by connecting a conveyor belt to the output.',
      MaxRenderDistance: '-1.000000',
      mHighlightVector: '(X=0.000000,Y=0.000000,Z=0.000000)',
      mMaterialNameToInstanceManager: '()',
      mSkipBuildEffect: 'False',
      mBuildEffectSpeed: '0.000000',
      mForceNetUpdateOnRegisterPlayer: 'False',
      mShouldShowHighlight: 'False',
      mAllowCleranceSeparationEvenIfStackedOn: 'False',
      mInteractingPlayers: '',
      mIsUseable: 'True',
    });

    expect(result).toStrictEqual({
      ClassName: 'Build_ManufacturerMk1_C',
      mAddToSignificanceManager: true,
      mAllowCleranceSeparationEvenIfStackedOn: false,
      MaxRenderDistance: -1.0,
      mBuildEffectSpeed: 0.0,
      mCanChangePotential: true,
      mDescription:
        'Crafts three or four parts into another part.\n\nCan be automated by feeding parts into it with a conveyor belt connected to the input. The produced parts can be automatically extracted by connecting a conveyor belt to the output.',
      mDisplayName: 'Manufacturer',
      mEffectUpdateInterval: 0.0,
      mForceNetUpdateOnRegisterPlayer: false,
      mHighlightVector: { X: 0.0, Y: 0.0, Z: 0.0 },
      mIsUseable: true,
      mMaxPotential: 1.0,
      mMaxPotentialIncreasePerCrystal: 0.5,
      mMinimumProducingTime: 2.0,
      mMinimumStoppedTime: 5.0,
      mMinPotential: 0.01,
      mNumCyclesForProductivity: 20,
      mPowerConsumption: 55.0,
      mPowerConsumptionExponent: 1.6,
      mShouldShowHighlight: false,
      mSignificanceBias: 0.0,
      mSignificanceRange: 18000.0,
      mSkipBuildEffect: false,
    });
  });
});
