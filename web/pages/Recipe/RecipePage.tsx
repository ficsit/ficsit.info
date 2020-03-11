import { css } from '@emotion/core';
import { Building } from '@local/schema';
import { useState } from 'react';
import { useParams } from 'react-router';

import { RecipeTable } from '~/components/RecipeTable';
import { Section } from '~/components/Section';
import { useRecipe, useEntities } from '~/data';
import { colors, sizing } from '~/style';

import { RecipeManualDetails } from './RecipeManualDetails';
import { RecipeManufacturerDetails } from './RecipeManufacturerDetails';

const rootStyles = css({
  padding: sizing.sectionPadding,
});

const contentStyles = css({
  display: 'grid',
  gridTemplateAreas: `
    "manufacturer recipe handcrafting"
  `,
  overflow: 'hidden',

  [`@media(max-width: ${sizing.minContentWidth + sizing.sidebarWidth}px)`]: {
    gridTemplateAreas: `
      "recipe recipe"
      "manufacturer handcrafting"
    `,
  },
});

const manufacturerContainerStyles = css({
  gridArea: 'manufacturer',
});

const handcraftingContainerStyles = css({
  gridArea: 'handcrafting',
});

const recipeContainerStyles = css({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
});

const contentContainerStyles = css({
  display: 'flex',
  gridArea: 'recipe',
  padding: sizing.Padding.Normal,
  margin: -1,
  border: `1px solid ${colors.Light.N100}`,
});

export function RecipePage() {
  const { slug } = useParams<{ slug?: string }>();

  return <_Detail slug={slug} />;
}

function _Detail({ slug }: { slug?: string }) {
  const entities = useEntities();
  const recipe = useRecipe(slug);
  // eslint-disable-next-line prefer-const
  let [clockSpeed, setClockSpeed] = useState(1.0);

  if (!recipe || !entities) return <div>…</div>;
  const manufacturer = entities[recipe.producedIn[0]] as Building;
  if (!manufacturer?.overclockable) clockSpeed = 1.0;

  return (
    <article css={rootStyles}>
      <Section title={<h1>{recipe.name}</h1>}>
        <div css={contentStyles}>
          {!!manufacturer && (
            <div css={[contentContainerStyles, manufacturerContainerStyles]}>
              <RecipeManufacturerDetails
                recipe={recipe}
                manufacturer={manufacturer}
                clockSpeed={clockSpeed}
                setClockSpeed={setClockSpeed}
              />
            </div>
          )}
          <div css={[contentContainerStyles, recipeContainerStyles]}>
            <RecipeTable
              recipes={[recipe]}
              renderTitle={() => undefined}
              showRates={() => clockSpeed}
              size={sizing.navListIconSize}
            />
            {/* <RecipeDetails recipe={recipe} entities={entities} clockSpeed={clockSpeed} /> */}
          </div>
          {!!recipe.handcraftedIn?.length && (
            <div css={[contentContainerStyles, handcraftingContainerStyles]}>
              <RecipeManualDetails recipe={recipe} />
            </div>
          )}
        </div>
      </Section>
    </article>
  );
}
