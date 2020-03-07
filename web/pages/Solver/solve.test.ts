import { solveFor } from './solve';

import { recipes, resources } from './solve.fixtures';

describe(`solve`, () => {
  it(`solves isolated recipes`, () => {
    const result = solveFor(recipes, resources, [
      { slug: 'iron-ingot', perMinute: 60 },
    ]);

    expect(result).toEqual({
      inputs: [{ slug: 'iron-ore', perMinute: 60 }],
      recipes: [{ slug: 'recipe-iron-ingot', multiple: 2 }],
      outputs: [{ slug: 'iron-ingot', perMinute: 60 }],
      residuals: [],
    });
  });

  it(`solves simple recipe chains`, () => {
    const result = solveFor(recipes, resources, [
      { slug: 'screw', perMinute: 300 },
    ]);

    expect(result).toEqual({
      inputs: [{ slug: 'iron-ore', perMinute: 75 }],
      recipes: [
        { slug: 'recipe-iron-ingot', multiple: 2.5 },
        { slug: 'recipe-iron-rod', multiple: 5 },
        { slug: 'recipe-screw', multiple: 7.5 },
      ],
      outputs: [{ slug: 'screw', perMinute: 300 }],
      residuals: [],
    });
  });

  it(`solves recipes with residual products`, () => {
    const result = solveFor(recipes, resources, [
      { slug: 'plastic', perMinute: 90 },
    ]);

    expect(result).toEqual({
      inputs: [{ slug: 'crude-oil', perMinute: 135000 }],
      recipes: [{ slug: 'recipe-plastic', multiple: 4.5 }],
      outputs: [{ slug: 'plastic', perMinute: 90 }],
      residuals: [{ slug: 'heavy-oil-residue', perMinute: 45000 }],
    });
  });

  it(`optimizes recipes with residual products`, () => {
    const result = solveFor(
      recipes,
      resources,
      [{ slug: 'plastic', perMinute: 90 }],
      { optimizeResiduals: true },
    );

    expect(result).toEqual({
      inputs: [{ slug: 'crude-oil', perMinute: 90000 }],
      recipes: [
        { slug: 'recipe-alternate-recycled-plastic', multiple: 1 },
        { slug: 'recipe-plastic', multiple: 1.5 },
        { slug: 'recipe-residual-fuel', multiple: 0.75 },
        { slug: 'recipe-rubber', multiple: 1.5 },
      ],
      outputs: [{ slug: 'plastic', perMinute: 90 }],
      residuals: [],
    });
  });
});
