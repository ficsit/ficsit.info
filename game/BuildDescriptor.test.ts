import { BuildDescriptorSchema } from './BuildDescriptor';
import { Reference } from './Reference';

describe(`schema.BuildDescriptor`, () => {
  it(`parses Desc_WalkwayCross_C from v116395`, () => {
    const result = BuildDescriptorSchema.parse({
      ClassName: "Desc_WalkwayCross_C",
      mSubCategories: "(BlueprintGeneratedClass'\"/Game/FactoryGame/Interface/UI/InGame/BuildMenu/BuildCategories/Sub_Organisation/SC_Walkways.SC_Walkways_C\"')",
      mBuildMenuPriority: "102.000000",
      mDisplayName: "",
      mAbbreviatedDisplayName: "",
      mDescription: "",
      mStackSize: "SS_MEDIUM",
      mCanBeDiscarded: "True",
      mRememberPickUp: "False",
      mEnergyValue: "0.000000",
      mRadioactiveDecay: "0.000000",
      mForm: "RF_INVALID",
      mFluidDensity: "1.000000",
      mFluidViscosity: "1.000000",
      mFluidFriction: "0.100000",
      mFluidColor: "(B=0,G=0,R=0,A=0)",
    });

    expect(result).toStrictEqual({
      ClassName: "Desc_WalkwayCross_C",
      mBuildMenuPriority: 102.0,
      mCanBeDiscarded: true,
      mDescription: "",
      mDisplayName: "",
      mAbbreviatedDisplayName: "",
      mEnergyValue: 0.0,
      mFluidColor: { R: 0, G: 0, B: 0, A: 0 },
      mFluidDensity: 1.0,
      mFluidFriction: 0.1,
      mFluidViscosity: 1.0,
      mForm: "RF_INVALID",
      mRadioactiveDecay: 0.0,
      mRememberPickUp: false,
      mStackSize: "SS_MEDIUM",
      mSubCategories: [
        new Reference('/Game/FactoryGame/Interface/UI/InGame/BuildMenu/BuildCategories/Sub_Organisation/SC_Walkways.SC_Walkways_C', 'BlueprintGeneratedClass'),
      ],
    });
  });
});
