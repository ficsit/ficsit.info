import { useState } from 'react';
import { useParams } from 'react-router';
import { css } from '@emotion/core';

import { useRecipe, useEntities } from '~/data';
import { colors, sizing } from '~/style';
import { Section } from '~/components/Section';
import { RecipeDetails } from './RecipeDetails';
import { Building } from '@local/schema';
import { RecipeManufacturerDetails } from './RecipeManufacturerDetails';
import { RecipeManualDetails } from './RecipeManualDetails';

const contentStyles = css({
  display: 'flex',
});

const contentContainerStyles = css({
  display: 'flex',
  padding: `0 ${sizing.Padding.Normal}px`,
  borderLeft: `1px solid ${colors.Light.N400}`,
  '&:first-of-type': {
    paddingLeft: 0,
    borderLeft: 'none',
  },
  '&:last-of-type': {
    paddingRight: 0,
  },
});

const recipeContainerStyles = css({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
});

export function RecipePage() {
  const { slug } = useParams<{ slug?: string }>();

  return <_Detail slug={slug} />;
}

function _Detail({ slug }: { slug?: string }) {
  const entities = useEntities();
  const recipe = useRecipe(slug);
  let [clockSpeed, setClockSpeed] = useState(1.0);

  if (!recipe || !entities) return <div>…</div>;
  const manufacturer = entities[recipe.producedIn[0]] as Building;
  if (!manufacturer?.overclockable) clockSpeed = 1.0;

  return (
    <article>
      <Section title={<h1>{recipe.name}</h1>}>
        <div css={contentStyles}>
          {!!manufacturer &&
            <div css={contentContainerStyles}>
              <RecipeManufacturerDetails recipe={recipe} manufacturer={manufacturer} clockSpeed={clockSpeed} setClockSpeed={setClockSpeed} />
            </div>
          }
          <div css={[contentContainerStyles, recipeContainerStyles]}>
            <RecipeDetails recipe={recipe} entities={entities} clockSpeed={clockSpeed} />
          </div>
          {!!recipe.handcraftedIn?.length &&
            <div css={contentContainerStyles}>
              <RecipeManualDetails recipe={recipe} />
            </div>
          }
        </div>
      </Section>
    </article>
  )
}
