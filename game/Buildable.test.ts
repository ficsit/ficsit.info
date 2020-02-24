import { BuildableSchema } from './Buildable';

describe(`schema.Buildable`, () => {
  it(`parses Build_PowerPoleMk1_C from v114480`, () => {
    const result = BuildableSchema.parse({
      ClassName: "Build_PowerPoleMk1_C",
      mDisplayName: "Power Pole",
      mDescription: "Can handle up to 4 Power Line connections.\r\n\r\nConnect Power Poles, Power Generators and factory buildings together with Power Lines to create a power grid. The power grid supplies the connected buildings with power.",
      MaxRenderDistance: "-1.000000",
      mHighlightVector: "(X=0.000000,Y=0.000000,Z=0.000000)",
      mMaterialNameToInstanceManager: "()",
      mSkipBuildEffect: "False",
      mBuildEffectSpeed: "0.000000",
      mForceNetUpdateOnRegisterPlayer: "False",
      mShouldShowHighlight: "False",
      mAllowCleranceSeparationEvenIfStackedOn: "False",
      mInteractingPlayers: "",
      mIsUseable: "True"
    });

    expect(result).toStrictEqual({
      ClassName: "Build_PowerPoleMk1_C",
      mAllowCleranceSeparationEvenIfStackedOn: false,
      MaxRenderDistance: -1.0,
      mBuildEffectSpeed: 0.0,
      mDescription: "Can handle up to 4 Power Line connections.\n\nConnect Power Poles, Power Generators and factory buildings together with Power Lines to create a power grid. The power grid supplies the connected buildings with power.",
      mDisplayName: "Power Pole",
      mForceNetUpdateOnRegisterPlayer: false,
      mHighlightVector: { X: 0.0, Y: 0.0, Z: 0.0 },
      mIsUseable: true,
      mShouldShowHighlight: false,
      mSkipBuildEffect: false,
    });
  });
});
