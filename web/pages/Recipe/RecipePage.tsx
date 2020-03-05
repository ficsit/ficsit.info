import { useState } from 'react';
import { useParams } from 'react-router';
import { css } from '@emotion/core';

import CycleTimeIcon from '~/assets/images/cycle-time.svg';
import PowerIcon from '~/assets/images/power.svg';

import { useRecipe, useEntities } from '~/data';
import { colors, sizing } from '~/style';
import { Section } from '~/components/Section';
import { RecipeDetails } from './RecipeDetails';
import { EntityLink } from '~/components/EntityLink';
import { Building } from '@local/schema';

const icon = css({
  fill: colors.Dark.N500,
  width: sizing.inlineIconSize,
  height: sizing.inlineIconSize,
});

const contentStyles = css({
  display: 'flex',
});

const statsStyles = css({
  display: 'flex',
  flexDirection: 'column',
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

  const duration = recipe.duration / clockSpeed;
  let powerUsage: number | undefined;
  if (manufacturer?.powerConsumption) {
    const { amount, exponent } = manufacturer.powerConsumption;
    powerUsage = amount * Math.pow(clockSpeed, exponent);
  }

  return (
    <article>
      <Section title={<h1>{recipe.name}</h1>}>
        <div css={contentStyles}>
          <div css={statsStyles}>
            <div><CycleTimeIcon css={icon} /> {duration.toFixed(1)} secs</div>
            {!!powerUsage && 
              <div><PowerIcon css={icon} /> {powerUsage.toFixed(1)} MW</div>
            }
            <EntityLink entity={manufacturer} />
            <input 
              type='range' 
              min={1} 
              max={250} 
              value={clockSpeed * 100} 
              onChange={({ target }) => setClockSpeed(parseInt(target.value) / 100)}
            />
          </div>
          <RecipeDetails recipe={recipe} entities={entities} clockSpeed={clockSpeed} />
        </div>
      </Section>
    </article>
  )
}
