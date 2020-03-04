import { useParams } from 'react-router';
import { css } from '@emotion/core';

import { useBuilding, useRecipe } from '~/data';
import { colors } from '~/style';
import { EntitySummary } from '~/components/EntitySummary';
import { Section } from '~/components/Section';
import { ItemCount } from '~/components/ItemCount';
// import { useState } from 'react';

const arrowStyles = css({
  display: 'flex',
  alignItems: 'center',
  gridColumn: '2 / 3',
  fontSize: 24,
  color: colors.Light.N400,
  paddingLeft: 3,
});

export function RecipePage() {
  const { slug } = useParams<{ slug?: string }>();

  return <_Detail slug={slug} />;
}

function _Detail({ slug }: { slug?: string }) {
  const recipe = useRecipe(slug);
  // let [clockSpeed, setClockSpeed] = useState(1.0);
  const building = useBuilding(recipe?.producedIn[0]);
  if (!recipe) return <div>…</div>;

  const statistics = {} as Record<string, React.ReactNode>;
  statistics[`Duration`] = `${recipe.duration} secs`;

  return (
    <article>
      <EntitySummary entity={recipe} imageSize={128} statistics={statistics} />
      <Section title='Recipe'>
        <div>
          {recipe.ingredients.map(({ item, count }) => 
            <ItemCount key={item} slug={item} count={count} />
          )}
        </div>
        <div css={arrowStyles}>➤</div>
        <div>
          {recipe.products.map(({ item, count }) => 
            <ItemCount key={item} slug={item} count={count} />
          )}
        </div>
      </Section>
      {building &&
        <Section title='Produced In'>
          <pre>{JSON.stringify(building, null, 2)}</pre>
        </Section>
      }
      <pre>{JSON.stringify(recipe, null, 2)}</pre>
    </article>
  )
}
