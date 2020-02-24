import { SchematicSchema } from './Schematic';
import { Reference } from './Reference';

describe(`schema.Schematic`, () => {
  it(`parses Research_Mycelia_2_C from v114480`, () => {
    const result = SchematicSchema.parse({
      ClassName: "Research_Mycelia_2_C",
      mType: "EST_MAM",
      mDisplayName: "Fabric",
      mSubCategories: "",
      mTechTier: "3",
      mCost: "((ItemClass=BlueprintGeneratedClass'\"/Game/FactoryGame/Resource/Parts/GenericBiomass/Desc_Mycelia.Desc_Mycelia_C\"',Amount=25),(ItemClass=BlueprintGeneratedClass'\"/Game/FactoryGame/Resource/Parts/GenericBiomass/Desc_GenericBiomass.Desc_GenericBiomass_C\"',Amount=100))",
      mShipTravelTimeAfterPurchase: "3.000000",
      mUnlocks: "(BP_UnlockRecipe_C'\"/Game/FactoryGame/Schematics/Research/Mycelia_RS/Research_Mycelia_2.Default__Research_Mycelia_2_C:BP_UnlockRecipe_C_0\"')",
      mAdditionalSchematicDependencies: "",
      mSchematicCategoryDeprecated: "ESC_LOGISTICS",
      mAssetBundleData: "",
      mIncludeInBuilds: "IIB_PublicBuilds",
    });

    expect(result).toStrictEqual({
      ClassName: 'Research_Mycelia_2_C',
      mAdditionalSchematicDependencies: [],
      mCost: [
        { 
          ItemClass: new Reference('/Game/FactoryGame/Resource/Parts/GenericBiomass/Desc_Mycelia.Desc_Mycelia_C', 'BlueprintGeneratedClass'),
          Amount: 25
        },
        {
          ItemClass: new Reference('/Game/FactoryGame/Resource/Parts/GenericBiomass/Desc_GenericBiomass.Desc_GenericBiomass_C', 'BlueprintGeneratedClass'),
          Amount: 100,
        },
      ],
      mDisplayName: 'Fabric',
      mShipTravelTimeAfterPurchase: 3.0,
      mSubCategories: [],
      mTechTier: 3,
      mType: 'EST_MAM',
      mUnlocks: [
        new Reference('/Game/FactoryGame/Schematics/Research/Mycelia_RS/Research_Mycelia_2.Default__Research_Mycelia_2_C:BP_UnlockRecipe_C_0', 'BP_UnlockRecipe_C'),
      ],
    });
  });
});
