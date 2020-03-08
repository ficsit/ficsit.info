import { useParams, useNavigate } from 'react-router';
import { EntityKind, Item } from '@local/schema';
import { css } from '@emotion/core';

import { useItem } from '~/data';
import { sizing } from '~/style';
import { MasterDetailLayout } from '~/layouts';
import { EntityList } from '~/components/EntityList';
import { EntitySummary } from '~/components/EntitySummary';
import { ItemSources } from './ItemSources';
import { ItemUses } from './ItemUses';
import { itemUrl } from '~/routing';

const rootStyles = css({
  padding: sizing.sectionPadding,
});

const detailsStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  [`@media(max-width: ${sizing.minContentWidth}px)`]: {
    gridTemplateColumns: 'repeat(1, 1fr)',
  },
});

export function ItemPage() {
  const { slug } = useParams<{ slug?: string }>();
  const item = useItem(slug);
  const navigate = useNavigate();

  return (
    <MasterDetailLayout
      master={
        <EntityList
          autoFocus
          depth={1}
          kind={EntityKind.Item}
          selected={slug}
          onChange={slug => navigate(itemUrl(slug))}
        />
      }
      detail={!!item && <_Detail item={item} />}
    />
  );
}

function _Detail({ item }: { item: Item }) {
  const statistics = {} as Record<string, React.ReactNode>;

  if (item.resource) {
    if (item.resource.extractedBy?.length) {
      statistics[`Source`] = `extracted`;
    } else if (item.resource.gatherable) {
      statistics[`Source`] = `gathered`;
    }
  }

  if (item.stackSize) {
    statistics[`Stack Size`] = item.stackSize;
  } else {
    statistics[`Form`] = item.form;
  }
  if (item.radioactivity) {
    // TODO: display this in a more meaningful way.
    statistics[`Radioactive!`] = `decay rate: ${item.radioactivity.decay}`;
  }
  if (item.equipment?.slot) {
    statistics[`Equipment Slot`] = item.equipment.slot;
  }
  if (item.equipment?.cost?.length) {
    // TODO: fix
    statistics[`Cost To Use`] = JSON.stringify(item.equipment.cost);
  }
  if (item.fuel?.energy) {
    // TODO: component for units/values.
    // TODO: better unit & value for liquids. (MJ / ml^3?)
    statistics[`Energy As Fuel`] = `${item.fuel.energy} MJ / item`;
  }

  return (
    <article css={rootStyles}>
      <EntitySummary entity={item} imageSize={128} statistics={statistics} />
      <div css={detailsStyles}>
        <ItemSources item={item} />
        <ItemUses item={item} />
      </div>
    </article>
  );
}
