import { ItemDescriptorSchema } from './ItemDescriptor';

describe(`schema.ItemDescriptor`, () => {
  it(`parses Desc_LiquidFuel_C from v114480`, () => {
    const result = ItemDescriptorSchema.parse({
      ClassName: "Desc_LiquidFuel_C",
      mDisplayName: "Fuel",
      mDescription: "Fuel is either converted into electricity or as fuel for vehicles.",
      mStackSize: "SS_FLUID",
      mCanBeDiscarded: "True",
      mRememberPickUp: "False",
      mEnergyValue: "0.600000",
      mRadioactiveDecay: "0.000000",
      mForm: "RF_LIQUID",
      mFluidDensity: "1.000000",
      mFluidViscosity: "2.000000",
      mFluidFriction: "0.100000",
      mFluidColor: "(B=122,G=131,R=244,A=255)",
    });

    expect(result).toStrictEqual({
      ClassName: 'Desc_LiquidFuel_C',
      mCanBeDiscarded: true,
      mDescription: 'Fuel is either converted into electricity or as fuel for vehicles.',
      mDisplayName: 'Fuel',
      mEnergyValue: 0.6,
      mFluidColor: { R: 244, G: 131, B: 122, A: 255 },
      mFluidDensity: 1.0,
      mFluidFriction: 0.1,
      mFluidViscosity: 2.0,
      mForm: 'RF_LIQUID',
      mRadioactiveDecay: 0.0,
      mRememberPickUp: false,
      mStackSize: 'SS_FLUID',
    });
  });
});
