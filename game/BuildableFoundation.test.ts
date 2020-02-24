import { BuildableFoundationSchema } from './BuildableFoundation';

describe(`schema.BuildableFoundation`, () => {
  it(`parses Build_Ramp_8x4_01_C from v114480`, () => {
    const result = BuildableFoundationSchema.parse({
      ClassName: "Build_Ramp_8x4_01_C",
      mSize: "800.000000",
      mHeight: "400.000000",
      mElevation: "0.000000",
      mDisableSnapOn: "(Front=True,Top=True)",
      mDisplayName: "Ramp 8m x 4m",
      mDescription: "Snaps to foundations to make it easier to get on top of them. Works especially well with vehicles.",
      MaxRenderDistance: "-1.000000",
      mHighlightVector: "(X=0.000000,Y=0.000000,Z=0.000000)",
      mMaterialNameToInstanceManager: "()",
      mSkipBuildEffect: "False",
      mBuildEffectSpeed: "0.000000",
      mForceNetUpdateOnRegisterPlayer: "False",
      mShouldShowHighlight: "False",
      mAllowCleranceSeparationEvenIfStackedOn: "True",
      mInteractingPlayers: "",
      mIsUseable: "False",
    });

    expect(result).toStrictEqual({
      ClassName: "Build_Ramp_8x4_01_C",
      mAllowCleranceSeparationEvenIfStackedOn: true,
      MaxRenderDistance: -1.0,
      mBuildEffectSpeed: 0.0,
      mDescription: "Snaps to foundations to make it easier to get on top of them. Works especially well with vehicles.",
      mDisableSnapOn: { Front: true, Top: true },
      mDisplayName: "Ramp 8m x 4m",
      mForceNetUpdateOnRegisterPlayer: false,
      mHeight: 400.0,
      mHighlightVector: { X: 0.0, Y: 0.0, Z: 0.0 },
      mIsUseable: false,
      mShouldShowHighlight: false,
      mSize: 800.0,
      mSkipBuildEffect: false,
    });
  });
});
