import { Indexable } from '@local/schema';
import { css } from '@emotion/core';
import { useMemo } from 'react';
import { AutoSizedStickyTree, Child } from 'react-virtualized-sticky-tree';

import { EntityLink } from './EntityLink';

type EntityTree = Map<string, Map<string, Indexable[]>>;

const categoryHeight = 20;
const subCategoryHeight = 16;
const rowHeight = 60;
const rowIconSize = rowHeight * 0.8;

const rootStyles = css({
  display: 'flex',
  flex: 1,
  width: 250,
});

const categoryTitleStyles = css({
  position: 'sticky',
  top: 0,
  lineHeight: `${categoryHeight}px`,
  fontSize: 16,
  margin: 0,
  paddingLeft: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  zIndex: 10,
});

const subCategoryTitleStyles = css({
  position: 'sticky',
  top: 20,
  lineHeight: `${subCategoryHeight}px`,
  fontSize: 12,
  margin: 0,
  paddingLeft: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  zIndex: 9,
});

const rowStyles = css({
  display: 'flex',
  alignItems: 'center',
  padding: (rowHeight - rowIconSize) / 2,
});

export interface EntityListProps {
  entitiesById: Record<string, Indexable>;
}

export function EntityList({ entitiesById }: EntityListProps) {
  const tree = useMemo(() => _entityTree(Object.values(entitiesById)), [entitiesById]);

  return (
    <AutoSizedStickyTree
      css={rootStyles}
      root={_nodeForId('--root--')}
      getChildren={id => _childNodesFor(tree, id)}
      rowRenderer={({ id, style }) => _renderNode(entitiesById, id, style)}
      renderRoot={false}
      overscanRowCount={5}
    />
  )
}

function _renderNode(entitiesById: Record<string, Indexable>, id: string, style: React.CSSProperties) {
  const { path, kind } = _nodeKind(id);
  if (kind === 'root') {
    throw new Error(`root should not be rendered`);
  } else if (kind === 'category') {
    return <div key={id} css={categoryTitleStyles} style={style}>{path}</div>;
  } else if (kind === 'subCategory') {
    return <div key={id} css={subCategoryTitleStyles} style={style}>{path}</div>;
  } else {
    const entity = entitiesById[path[2]];
    if (!entity) {
      throw new Error(`Expected ${path[2]} to exist as an entity`);
    }
    return <EntityLink key={id} size={rowIconSize} entity={entity} style={style} css={rowStyles} />;
  }
}

// function _renderCategory({ title, subCategories }: Category, index: number) {
//   return (
//     <div key={index}>
//       <h2 css={categoryTitleStyles}>{title || 'Miscellaneous'}</h2>
//       {subCategories.map(_renderSubCategory)}
//     </div>
//   )
// }

// function _renderSubCategory({ title, entities }: SubCategory, index: number) {
//   return (
//     <div key={index}>
//       <h3 css={subCategoryTitleStyles}>{title || 'Miscellaneous'}</h3>
//       {entities.map(entity => <EntityLink key={entity.slug} entity={entity} css={entityStyles} />)}
//     </div>
//   )
// }

function _entityTree(allEntities: Indexable[]) {
  const indexed: EntityTree = new Map();

  for (const entity of allEntities.sort((a, b) => (a.listOrder || Number.MAX_SAFE_INTEGER) - (b.listOrder || Number.MAX_SAFE_INTEGER))) {
    let [category, subCategory] = entity.categories || [];
    category = category || 'Miscellaneous';
    subCategory = subCategory || 'Miscellaneous';

    if (!indexed.has(category)) indexed.set(category, new Map());
    const categoryMap = indexed.get(category)!;
    if (!categoryMap.has(subCategory)) categoryMap.set(subCategory, []);
    categoryMap.get(subCategory)!.push(entity);
  }

  return indexed;
}

function _nodeForId(id: string): Child {
  const { kind } = _nodeKind(id);
  if (kind === 'root') {
    return { id, height: 0 };
  } else if (kind === 'category') {
    return { id, height: categoryHeight, isSticky: true, stickyTop: 0, zIndex: 200 };
  } else if (kind === 'subCategory') {
    return { id, height: subCategoryHeight, isSticky: true, stickyTop: categoryHeight, zIndex: 100 };
  } else {
    return { id, height: rowHeight };
  }
}

function _childNodesFor(tree: EntityTree, id: string): Child[] {
  const { path, kind } = _nodeKind(id);
  if (kind === 'root') {
    return Array.from(tree.keys()).map(key => _nodeForId(key));
  } else if (kind === 'category') {
    const [categoryId] = path;
    const category = tree.get(categoryId)!;
    return Array.from(category.keys()).map(key => _nodeForId(`${categoryId}◈${key}`));
  } else if (kind === 'subCategory') {
    const [categoryId, subCategoryId] = path;
    const category = tree.get(categoryId)!;
    const subCategory = category.get(subCategoryId)!;
    return subCategory.map(({ slug }) => _nodeForId(`${categoryId}◈${subCategoryId}◈${slug}`));
  } else {
    return [];
  }
}

function _nodeKind(id: string) {
  if (id === '--root--') return { path: [], kind: 'root' };
  const path = id.split('◈');
  if (path.length === 1) {
    return { path, kind: 'category' };
  } else if (path.length === 2) {
    return { path, kind: 'subCategory' };
  } else {
    return { path, kind: 'entity' };
  }
}
