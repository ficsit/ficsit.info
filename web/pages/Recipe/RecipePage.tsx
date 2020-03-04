import { useParams } from 'react-router';
import { Recipe } from '@local/schema';
import { css } from '@emotion/core';

import { useRecipes, useBuilding } from '~/data';
import { colors } from '~/style';
import { MasterDetailLayout } from '~/layouts';
import { EntityList } from '~/components/EntityList';
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
  const recipes = useRecipes();
  if (!recipes) return <div>…</div>;

  const recipe = slug ? recipes[slug] : undefined;

  return (
    <MasterDetailLayout 
      master={<EntityList entitiesById={recipes} />}
      detail={<_Detail recipe={recipe} />}
    />
  );
}

function _Detail({ recipe }: { recipe?: Recipe }) {
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
