import { BuildableConveyorBaseSchema } from './BuildableConveyorBase';

describe(`schema.BuildableConveyorBase`, () => {
  it(`parses Build_ConveyorBeltMk3_C from v114480`, () => {
    const result = BuildableConveyorBaseSchema.parse({
      ClassName: 'Build_ConveyorBeltMk3_C',
      mMeshLength: '200.000000',
      mItemMeshMap: '()',
      mSplineData: '',
      mSpeed: '540.000000',
      mItems: '()',
      mDisplayName: 'Conveyor Belt Mk.3',
      mDescription: 'Transports up to 270 resources per minute. Used to move resources between buildings.',
      MaxRenderDistance: '-1.000000',
      mHighlightVector: '(X=0.000000,Y=0.000000,Z=0.000000)',
      mMaterialNameToInstanceManager: '()',
      mSkipBuildEffect: 'False',
      mBuildEffectSpeed: '0.000000',
      mForceNetUpdateOnRegisterPlayer: 'False',
      mShouldShowHighlight: 'False',
      mAllowCleranceSeparationEvenIfStackedOn: 'False',
      mInteractingPlayers: '',
      mIsUseable: 'False',
    });

    expect(result).toStrictEqual({
      ClassName: 'Build_ConveyorBeltMk3_C',
      mAllowCleranceSeparationEvenIfStackedOn: false,
      MaxRenderDistance: -1.0,
      mBuildEffectSpeed: 0.0,
      mDescription: 'Transports up to 270 resources per minute. Used to move resources between buildings.',
      mDisplayName: 'Conveyor Belt Mk.3',
      mForceNetUpdateOnRegisterPlayer: false,
      mHighlightVector: { X: 0.0, Y: 0.0, Z: 0.0 },
      mIsUseable: false,
      mMeshLength: 200.0,
      mShouldShowHighlight: false,
      mSkipBuildEffect: false,
      mSpeed: 540.0,
    });
  });
});
