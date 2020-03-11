import { BuildableResourceExtractorSchema } from './BuildableResourceExtractor';

describe(`schema.BuildableResourceExtractor`, () => {
  it(`parses Build_WaterPump_C from v116395`, () => {
    const result = BuildableResourceExtractorSchema.parse({
      ClassName: 'Build_WaterPump_C',
      HasLostSignificance: 'False',
      mAddToSignificanceManager: 'True',
      mAllowCleranceSeparationEvenIfStackedOn: 'False',
      mAllowedResourceForms: '(RF_LIQUID)',
      mAllowedResources:
        '(BlueprintGeneratedClass\'"/Game/FactoryGame/Resource/RawResources/Water/Desc_Water.Desc_Water_C"\')',
      mAudioTimelineCounter: '0.000000',
      mAudioTimerCounter: '0.000000',
      mAudioTimerMS: '0.100000',
      mAudioTimerReference: '()',
      MaxRenderDistance: '-1.000000',
      mBuildEffectSpeed: '0.000000',
      mCanChangePotential: 'True',
      mDepthTraceOriginOffset: '(X=0.000000,Y=300.000000,Z=200.000000)',
      mDescription:
        'Default extraction rate: 120m3 water per minute.\r\nDefault pressure: 10, allowing a 10 meter vertical rise of fluids.\r\n\r\nExtracts water from the body of water it is build on.\r\nNote that the water needs to be deep enough and that rivers do not commonly suffice.',
      mDisplayName: 'Water Extractor',
      mEffectUpdateInterval: '0.000000',
      mExtractCycleTime: '1.000000',
      mExtractionOffset: '(X=0.000000,Y=0.000000,Z=0.000000)',
      mExtractorTypeName: 'None',
      mExtractStartupTime: '10.000000',
      mFluidStackSizeDefault: 'SS_FLUID',
      mFluidStackSizeMultiplier: '4',
      mForceNetUpdateOnRegisterPlayer: 'False',
      mHighlightVector: '(X=0.000000,Y=0.000000,Z=0.000000)',
      mInteractingPlayers: '',
      mIsUseable: 'True',
      mItemsPerCycle: '2000',
      mMaterialNameToInstanceManager: '()',
      mMaxPotential: '1.000000',
      mMaxPotentialIncreasePerCrystal: '0.500000',
      mMinimumDepthForPlacement: '50.000000',
      mMinimumProducingTime: '2.000000',
      mMinimumStoppedTime: '5.000000',
      mMinPotential: '0.010000',
      mNumCyclesForProductivity: '20',
      mOnHasPowerChanged: '()',
      mOnHasProductionChanged: '()',
      mOnlyAllowCertainResources: 'True',
      mPipeOutputConnections: '',
      mPowerConsumption: '20.000000',
      mPowerConsumptionExponent: '1.600000',
      mReplicatedFlowRate: '0.000000',
      mRequireResourceAtMinimumDepthChecks: 'True',
      mShouldShowHighlight: 'False',
      mSignificanceBias: '0.000000',
      mSignificanceRange: '18000.000000',
      mSkipBuildEffect: 'False',
      mWaterpumpTimeline__Direction_B8FA6F944E717E3B7A286E84901F620E: 'Forward',
      mWaterpumpTimeline_RTPC_B8FA6F944E717E3B7A286E84901F620E: '0.000000',
      OnReplicationDetailActorCreatedEvent: '()',
      PlayPitchAndVolumeRTPCTimeline__Direction_2B435F41466C37D2AD809A88AA21BA89: 'Forward',
      PlayPitchAndVolumeRTPCTimeline_RTPC_2B435F41466C37D2AD809A88AA21BA89: '0.000000',
    });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "ClassName": "Build_WaterPump_C",
        "MaxRenderDistance": -1,
        "mAddToSignificanceManager": true,
        "mAllowCleranceSeparationEvenIfStackedOn": false,
        "mAllowedResourceForms": Array [
          "RF_LIQUID",
        ],
        "mAllowedResources": Array [
          "<reference:Desc_Water_C>",
        ],
        "mBuildEffectSpeed": 0,
        "mCanChangePotential": true,
        "mDescription": "Default extraction rate: 120m3 water per minute.
      Default pressure: 10, allowing a 10 meter vertical rise of fluids.

      Extracts water from the body of water it is build on.
      Note that the water needs to be deep enough and that rivers do not commonly suffice.",
        "mDisplayName": "Water Extractor",
        "mEffectUpdateInterval": 0,
        "mExtractCycleTime": 1,
        "mExtractStartupTime": 10,
        "mForceNetUpdateOnRegisterPlayer": false,
        "mHighlightVector": Object {
          "X": 0,
          "Y": 0,
          "Z": 0,
        },
        "mIsUseable": true,
        "mItemsPerCycle": 2000,
        "mMaxPotential": 1,
        "mMaxPotentialIncreasePerCrystal": 0.5,
        "mMinPotential": 0.01,
        "mMinimumProducingTime": 2,
        "mMinimumStoppedTime": 5,
        "mNumCyclesForProductivity": 20,
        "mOnlyAllowCertainResources": true,
        "mPowerConsumption": 20,
        "mPowerConsumptionExponent": 1.6,
        "mShouldShowHighlight": false,
        "mSignificanceBias": 0,
        "mSignificanceRange": 18000,
        "mSkipBuildEffect": false,
      }
    `);
  });

  it(`parses Build_MinerMk2_C from v116395`, () => {
    const result = BuildableResourceExtractorSchema.parse({
      ClassName: 'Build_MinerMk2_C',
      mParticleMap:
        '((ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3=/Game/FactoryGame/Resource/RawResources/Coal/Desc_Coal.Desc_Coal_C,ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD=ParticleSystem\'"/Game/FactoryGame/Buildable/Factory/MinerMk2/Particle/MiningCoal.MiningCoal"\'),(ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3=/Game/FactoryGame/Resource/RawResources/Stone/Desc_Stone.Desc_Stone_C,ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD=ParticleSystem\'"/Game/FactoryGame/Buildable/Factory/MinerMk2/Particle/MiningStone.MiningStone"\'),(ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3=/Game/FactoryGame/Resource/RawResources/OreIron/Desc_OreIron.Desc_OreIron_C,ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD=ParticleSystem\'"/Game/FactoryGame/Buildable/Factory/MinerMk2/Particle/MiningIron.MiningIron"\'),(ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3=/Game/FactoryGame/Resource/RawResources/OreBauxite/Desc_OreBauxite.Desc_OreBauxite_C,ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD=ParticleSystem\'"/Game/FactoryGame/Buildable/Factory/MinerMk2/Particle/MiningCopper.MiningCopper"\'),(ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3=/Game/FactoryGame/Resource/RawResources/OreCopper/Desc_OreCopper.Desc_OreCopper_C,ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD=ParticleSystem\'"/Game/FactoryGame/Buildable/Factory/MinerMk2/Particle/MiningCopper.MiningCopper"\'),(ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3=/Game/FactoryGame/Resource/RawResources/CrudeOil/Desc_LiquidOil.Desc_LiquidOil_C,ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD=ParticleSystem\'"/Game/FactoryGame/Buildable/Factory/MinerMk2/Particle/Mining.Mining"\'),(ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3=/Game/FactoryGame/Resource/RawResources/OreGold/Desc_OreGold.Desc_OreGold_C,ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD=ParticleSystem\'"/Game/FactoryGame/Buildable/Factory/MinerMk2/Particle/Mining.Mining"\'),(ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3=/Game/FactoryGame/Resource/RawResources/RawQuartz/Desc_RawQuartz.Desc_RawQuartz_C,ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD=ParticleSystem\'"/Game/FactoryGame/Buildable/Factory/MinerMk2/Particle/Mining.Mining"\'),(ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3=/Game/FactoryGame/Resource/RawResources/Sulfur/Desc_Sulfur.Desc_Sulfur_C,ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD=ParticleSystem\'"/Game/FactoryGame/Buildable/Factory/MinerMk2/Particle/Mining.Mining"\'),(ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3=/Game/FactoryGame/Resource/RawResources/OreUranium/Desc_OreUranium.Desc_OreUranium_C,ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD=ParticleSystem\'"/Game/FactoryGame/Buildable/Factory/MinerMk2/Particle/Mining.Mining"\'))',
      mCanPlayAfterStartUpStopped: 'False',
      mExtractStartupTime: '15.000000',
      mExtractCycleTime: '0.500000',
      mItemsPerCycle: '1',
      mAllowedResourceForms: '(RF_SOLID)',
      mRequireResourceAtMinimumDepthChecks: 'False',
      mMinimumDepthForPlacement: '0.000000',
      mDepthTraceOriginOffset: '(X=0.000000,Y=0.000000,Z=0.000000)',
      mOnlyAllowCertainResources: 'False',
      mAllowedResources: '',
      mExtractionOffset: '(X=0.000000,Y=0.000000,Z=0.000000)',
      mExtractorTypeName: 'Miner',
      mPipeOutputConnections: '',
      mReplicatedFlowRate: '0.000000',
      mPowerConsumption: '12.000000',
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
      mDisplayName: 'Miner Mk.2',
      mDescription:
        'Extracts solid resources from the resource node it is built on. \r\nThe normal extraction rate is 120 resources per minute. \r\nThe extraction rate is modified depending on resource node purity. Outputs all extracted resources onto connected conveyor belts.',
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

    expect(result).toMatchInlineSnapshot(`
Object {
  "ClassName": "Build_MinerMk2_C",
  "MaxRenderDistance": -1,
  "mAddToSignificanceManager": true,
  "mAllowCleranceSeparationEvenIfStackedOn": false,
  "mAllowedResourceForms": Array [
    "RF_SOLID",
  ],
  "mAllowedResources": Array [],
  "mBuildEffectSpeed": 0,
  "mCanChangePotential": true,
  "mDescription": "Extracts solid resources from the resource node it is built on. 
The normal extraction rate is 120 resources per minute. 
The extraction rate is modified depending on resource node purity. Outputs all extracted resources onto connected conveyor belts.",
  "mDisplayName": "Miner Mk.2",
  "mEffectUpdateInterval": 0,
  "mExtractCycleTime": 0.5,
  "mExtractStartupTime": 15,
  "mForceNetUpdateOnRegisterPlayer": false,
  "mHighlightVector": Object {
    "X": 0,
    "Y": 0,
    "Z": 0,
  },
  "mIsUseable": true,
  "mItemsPerCycle": 1,
  "mMaxPotential": 1,
  "mMaxPotentialIncreasePerCrystal": 0.5,
  "mMinPotential": 0.01,
  "mMinimumProducingTime": 2,
  "mMinimumStoppedTime": 5,
  "mNumCyclesForProductivity": 20,
  "mOnlyAllowCertainResources": false,
  "mParticleMap": Array [
    Object {
      "ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD": "<reference:MiningCoal>",
      "ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3": "<reference:Desc_Coal_C>",
    },
    Object {
      "ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD": "<reference:MiningStone>",
      "ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3": "<reference:Desc_Stone_C>",
    },
    Object {
      "ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD": "<reference:MiningIron>",
      "ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3": "<reference:Desc_OreIron_C>",
    },
    Object {
      "ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD": "<reference:MiningCopper>",
      "ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3": "<reference:Desc_OreBauxite_C>",
    },
    Object {
      "ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD": "<reference:MiningCopper>",
      "ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3": "<reference:Desc_OreCopper_C>",
    },
    Object {
      "ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD": "<reference:Mining>",
      "ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3": "<reference:Desc_LiquidOil_C>",
    },
    Object {
      "ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD": "<reference:Mining>",
      "ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3": "<reference:Desc_OreGold_C>",
    },
    Object {
      "ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD": "<reference:Mining>",
      "ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3": "<reference:Desc_RawQuartz_C>",
    },
    Object {
      "ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD": "<reference:Mining>",
      "ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3": "<reference:Desc_Sulfur_C>",
    },
    Object {
      "ParticleSystem1_9_F0CF81514E1E1C5007AC99B0C59C63CD": "<reference:Mining>",
      "ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3": "<reference:Desc_OreUranium_C>",
    },
  ],
  "mPowerConsumption": 12,
  "mPowerConsumptionExponent": 1.6,
  "mShouldShowHighlight": false,
  "mSignificanceBias": 0,
  "mSignificanceRange": 18000,
  "mSkipBuildEffect": false,
}
`);
  });
});
