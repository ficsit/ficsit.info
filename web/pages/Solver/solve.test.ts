import { AnyEntity, Recipe } from '@local/schema';

import { solveFor } from './solve';

import rawEntities from './__fixtures__/entities.json';
import rawRecipes from './__fixtures__/recipes.json';

const entities = rawEntities as Record<string, AnyEntity>;
const recipes = rawRecipes as Record<string, Recipe>;

describe(`solve`, () => {
  it(`solves isolated recipes`, () => {
    const result = solveFor(recipes, entities, {
      targets: [{ slug: 'iron-ingot', perMinute: 60 }],
    });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "inputs": Array [
          Object {
            "perMinute": 60,
            "slug": "iron-ore",
          },
        ],
        "outputs": Array [
          Object {
            "perMinute": 60,
            "slug": "iron-ingot",
          },
        ],
        "recipes": Array [
          Object {
            "multiple": 2,
            "slug": "recipe-iron-ingot",
          },
        ],
        "residuals": Array [],
      }
    `);
  });

  it(`solves simple recipe chains`, () => {
    const result = solveFor(recipes, entities, {
      targets: [{ slug: 'screw', perMinute: 300 }],
    });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "inputs": Array [
          Object {
            "perMinute": 75,
            "slug": "iron-ore",
          },
        ],
        "outputs": Array [
          Object {
            "perMinute": 300,
            "slug": "screw",
          },
        ],
        "recipes": Array [
          Object {
            "multiple": 2.5,
            "slug": "recipe-iron-ingot",
          },
          Object {
            "multiple": 5,
            "slug": "recipe-iron-rod",
          },
          Object {
            "multiple": 7.5,
            "slug": "recipe-screw",
          },
        ],
        "residuals": Array [],
      }
    `);
  });

  it(`solves recipes with residual products`, () => {
    const result = solveFor(recipes, entities, {
      targets: [{ slug: 'plastic', perMinute: 90 }],
    });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "inputs": Array [
          Object {
            "perMinute": 135000,
            "slug": "crude-oil",
          },
        ],
        "outputs": Array [
          Object {
            "perMinute": 90,
            "slug": "plastic",
          },
        ],
        "recipes": Array [
          Object {
            "multiple": 4.5,
            "slug": "recipe-plastic",
          },
        ],
        "residuals": Array [
          Object {
            "perMinute": 45000,
            "slug": "heavy-oil-residue",
          },
        ],
      }
    `);
  });

  it(`optimizes recipes with residual products`, () => {
    const result = solveFor(recipes, entities, {
      targets: [{ slug: 'plastic', perMinute: 90 }],
      optimizeResiduals: true,
      includeAlternateRecipes: true,
    });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "inputs": Array [
          Object {
            "perMinute": 86250,
            "slug": "crude-oil",
          },
          Object {
            "perMinute": 15000,
            "slug": "water",
          },
        ],
        "outputs": Array [
          Object {
            "perMinute": 90,
            "slug": "plastic",
          },
        ],
        "recipes": Array [
          Object {
            "multiple": 1.5,
            "slug": "recipe-alternate-recycled-plastic",
          },
          Object {
            "multiple": 0.5,
            "slug": "recipe-fuel",
          },
          Object {
            "multiple": 0.625,
            "slug": "recipe-residual-fuel",
          },
          Object {
            "multiple": 0.375,
            "slug": "recipe-residual-rubber",
          },
          Object {
            "multiple": 1.875,
            "slug": "recipe-rubber",
          },
        ],
        "residuals": Array [],
      }
    `);
  });
});
