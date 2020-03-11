import { RecipeSchema } from './Recipe';
import { Reference } from './Reference';

describe(`schema.Recipe`, () => {
  it(`parses Recipe_LiquidFuel_C from v114480`, () => {
    const result = RecipeSchema.parse({
      ClassName: `Recipe_LiquidFuel_C`,
      mDisplayName: `Fuel`,
      mIngredients: `((ItemClass=BlueprintGeneratedClass'"/Game/FactoryGame/Resource/RawResources/CrudeOil/Desc_LiquidOil.Desc_LiquidOil_C"',Amount=6000))`,
      mProduct: `((ItemClass=BlueprintGeneratedClass'"/Game/FactoryGame/Resource/Parts/Fuel/Desc_LiquidFuel.Desc_LiquidFuel_C"',Amount=4000),(ItemClass=BlueprintGeneratedClass'"/Game/FactoryGame/Resource/Parts/PolymerResin/Desc_PolymerResin.Desc_PolymerResin_C"',Amount=3))`,
      mManufactoringDuration: `6.000000`,
      mManualManufacturingMultiplier: `1.000000`,
      mProducedIn: `(/Game/FactoryGame/Buildable/Factory/OilRefinery/Build_OilRefinery.Build_OilRefinery_C)`,
    });

    expect(result).toStrictEqual({
      ClassName: 'Recipe_LiquidFuel_C',
      mDisplayName: 'Fuel',
      mIngredients: [
        {
          ItemClass: new Reference(
            '/Game/FactoryGame/Resource/RawResources/CrudeOil/Desc_LiquidOil.Desc_LiquidOil_C',
            'BlueprintGeneratedClass',
          ),
          Amount: 6000,
        },
      ],
      mManualManufacturingMultiplier: 1.0,
      mManufactoringDuration: 6.0,
      mProducedIn: [
        new Reference(
          '/Game/FactoryGame/Buildable/Factory/OilRefinery/Build_OilRefinery.Build_OilRefinery_C',
        ),
      ],
      mProduct: [
        {
          ItemClass: new Reference(
            '/Game/FactoryGame/Resource/Parts/Fuel/Desc_LiquidFuel.Desc_LiquidFuel_C',
            'BlueprintGeneratedClass',
          ),
          Amount: 4000,
        },
        {
          ItemClass: new Reference(
            '/Game/FactoryGame/Resource/Parts/PolymerResin/Desc_PolymerResin.Desc_PolymerResin_C',
            'BlueprintGeneratedClass',
          ),
          Amount: 3,
        },
      ],
    });
  });
});
