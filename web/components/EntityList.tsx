import { Indexable } from '@local/schema';
import { css } from '@emotion/core';

import { EntityLink } from './EntityLink';

const entityStyles = css({
  display: 'flex',
});

const categoryTitleStyles = css({
  position: 'sticky',
  top: 0,
  lineHeight: '20px',
  fontSize: 16,
  margin: 0,
  paddingLeft: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  zIndex: 10,
});

const subCategoryTitleStyles = css({
  position: 'sticky',
  top: 20,
  lineHeight: '16px',
  fontSize: 12,
  margin: 0,
  paddingLeft: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  zIndex: 9,
});

export interface EntityListProps {
  entities: Indexable[];
}

export function EntityList({ entities }: EntityListProps) {
  const categories = _entitiesByCategories(entities);

  return (
    <div>
      {categories.map(_renderCategory)}
    </div>
  )
}

function _renderCategory({ title, subCategories }: Category) {
  return (
    <div>
      <h2 css={categoryTitleStyles}>{title || 'Miscellaneous'}</h2>
      {subCategories.map(_renderSubCategory)}
    </div>
  )
}

function _renderSubCategory({ title, entities }: SubCategory) {
  return (
    <div>
      <h3 css={subCategoryTitleStyles}>{title || 'Miscellaneous'}</h3>
      {entities.map(entity => <EntityLink entity={entity} css={entityStyles} />)}
    </div>
  )
}

interface Category {
  title?: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  title?: string;
  entities: Indexable[];
}

function _entitiesByCategories(allEntities: Indexable[]): Category[] {
  const indexed = new Map<string | undefined, Map<string | undefined, Indexable[]>>();

  for (const entity of allEntities.sort((a, b) => (a.listOrder || Number.MAX_SAFE_INTEGER) - (b.listOrder || Number.MAX_SAFE_INTEGER))) {
    const [category, subCategory] = entity.categories || [];
    if (!indexed.has(category)) indexed.set(category, new Map());
    const categoryMap = indexed.get(category)!;
    if (!categoryMap.has(subCategory)) categoryMap.set(subCategory, []);
    categoryMap.get(subCategory)!.push(entity);
  }

  const categories = [] as Category[];
  for (const [categoryTitle, categoryMap] of indexed.entries()) {
    const subCategories = [] as SubCategory[];
    for (const [subCategoryTitle, entities] of categoryMap.entries()) {
      subCategories.push({ title: subCategoryTitle, entities });
    }
    categories.push({ title: categoryTitle, subCategories });
  }

  return categories;
}
