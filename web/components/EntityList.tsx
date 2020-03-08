import { NavLink } from 'react-router-dom';
import { EntityKind, AnyEntity } from '@local/schema';
import { css } from '@emotion/core';
import { useMemo, useState, useEffect } from 'react';
import {
  AutoSizedStickyTree,
  RegularChild,
  StickyChild,
  RowInfo,
  NodeId,
} from 'react-virtualized-sticky-tree';

import { colors, sizing } from '~/style';
import { entityUrl } from '~/routing';
import { useEntitiesByKind } from '~/data';

import { HighlightedText } from './HighlightedText';
import { EntityImage } from './EntityImage';

type EntityTree = Map<string, Map<string, AnyEntity[]>>;

interface RootNode extends RegularChild {
  kind: 'root';
  childNodes: CategoryNode[];
}
interface CategoryNode extends StickyChild {
  kind: 'category';
  title: string;
  childNodes: SubCategoryNode[];
}
interface SubCategoryNode extends StickyChild {
  kind: 'subCategory';
  title: string;
  childNodes: EntityNode[];
}
interface EntityNode extends RegularChild {
  kind: 'entity';
  entity: AnyEntity;
}
type AnyNode = RootNode | CategoryNode | SubCategoryNode | EntityNode;

const categoryHeight = 20;
const subCategoryHeight = 16;
const entityHeight = 60;
const rowIconSize = entityHeight * 0.8;

const rootStyles = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const listStyles = css({
  flex: 1,
  height: '100%',
  '> *': {
    overscrollBehavior: 'contain',
  },
});

const categoryTitleStyles = css({
  position: 'sticky',
  top: 0,
  lineHeight: `${categoryHeight}px`,
  fontSize: 16,
  margin: 0,
  paddingLeft: 8,
  color: colors.Light.N0,
  backgroundColor: colors.Secondary.N800,
  zIndex: 10,
});

const subCategoryTitleStyles = css({
  position: 'sticky',
  top: 20,
  lineHeight: `${subCategoryHeight}px`,
  fontSize: 12,
  margin: 0,
  paddingLeft: 8,
  color: colors.Light.N0,
  backgroundColor: colors.Secondary.N800,
  zIndex: 9,
});

const entityStyles = css({
  display: 'flex',
  alignItems: 'center',
  padding: `${(entityHeight - rowIconSize) / 2}px 8px`,
  color: 'inherit',
  textDecoration: 'none',
  picture: {
    marginRight: 8,
  },
  ':hover, &.active': {
    color: colors.Light.N0,
    picture: {
      filter: `
        drop-shadow( 2px 0   1px ${colors.Light.N0})
        drop-shadow(-2px 0   1px ${colors.Light.N0})
        drop-shadow( 0   2px 1px ${colors.Light.N0})
        drop-shadow( 0  -2px 1px ${colors.Light.N0})
      `,
      // filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.65))',
    },
  },
  ':hover': {
    backgroundColor: `${colors.Primary.N500}aa`,
  },
  '&.active': {
    backgroundColor: colors.Primary.N500,
  },
});

export interface EntityListProps {
  kind: EntityKind;
  selected?: string;
  onChange?: (newSelected: string) => void;
  autoFocus?: boolean;
}

export function EntityList({
  kind,
  selected,
  onChange,
  autoFocus,
}: EntityListProps) {
  const [filter, setFilter] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const entities = useEntitiesByKind(kind);
  const fullTree = useMemo(() => _dataSource(entities), [entities]);
  const selectedId = useMemo(() => _findId(fullTree, selected), [
    fullTree,
    selected,
  ]);
  const tree = useMemo(() => _filterTree(fullTree, filter), [fullTree, filter]);

  const inputRef = React.createRef<HTMLInputElement>();
  const treeRef = React.createRef<AutoSizedStickyTree<AnyNode>>();
  // scroll after our first render /w a tree
  useEffect(() => {
    if (scrolled) return;
    const { current } = treeRef;
    if (!current) return;
    current.scrollNodeIntoView(selectedId!);
    setScrolled(true);
  });

  if (!tree) return null;

  return (
    <div
      css={rootStyles}
      onClick={() => {
        // Give a brief delay before focusing in case we're navigating on
        // mobile.
        const input = inputRef.current;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => input?.focus()),
        );
      }}>
      <input
        ref={inputRef}
        autoFocus={autoFocus}
        type='text'
        placeholder='Search…'
        value={filter}
        onChange={({ target }) => {
          setFilter(target.value);
          treeRef.current?.setScrollTop(0);
        }}
        onKeyDown={event => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
          } else {
            return;
          }
          const { current } = treeRef;
          if (!current) return;

          let newNodeIndex;
          if (event.key === 'ArrowDown') {
            if (selectedId) {
              newNodeIndex = _findAdjacentEntityIndex(
                current,
                selectedId,
                'down',
              );
            } else {
              newNodeIndex = current.nodes.findIndex(n => n.kind === 'entity');
            }
          } else if (event.key === 'ArrowUp') {
            if (selectedId) {
              newNodeIndex = _findAdjacentEntityIndex(
                current,
                selectedId,
                'up',
              );
            }
          }

          if (!newNodeIndex) return;
          onChange?.((current.nodes[newNodeIndex] as EntityNode).entity.slug);

          if (current.isIndexVisible(newNodeIndex)) return;
          current.scrollIndexIntoView(newNodeIndex, event.key === 'ArrowUp');
        }}
      />
      <AutoSizedStickyTree
        treeRef={treeRef}
        css={listStyles}
        root={tree}
        isModelImmutable={true}
        getChildren={(_id, parent: AnyNode) => (parent as any).childNodes}
        rowRenderer={nodeInfo => _renderNode(nodeInfo, filter)}
        renderRoot={false}
        overscanRowCount={5}
      />
    </div>
  );
}

function _renderNode(
  { id, style, nodeInfo }: RowInfo<AnyNode>,
  filter: string,
) {
  if (nodeInfo.kind === 'category') {
    return (
      <div key={id} css={categoryTitleStyles} style={style}>
        {nodeInfo.title}
      </div>
    );
  } else if (nodeInfo.kind === 'subCategory') {
    return (
      <div key={id} css={subCategoryTitleStyles} style={style}>
        {nodeInfo.title}
      </div>
    );
  } else if (nodeInfo.kind === 'entity') {
    return (
      <NavLink
        key={id}
        css={entityStyles}
        style={style}
        to={entityUrl(nodeInfo.entity)}>
        <EntityImage entity={nodeInfo.entity} size={sizing.navListIconSize} />
        <HighlightedText text={nodeInfo.entity.name} search={filter} />
      </NavLink>
    );
  } else {
    throw new Error(`Unsupported ${nodeInfo.kind} node`);
  }
}

function _dataSource(entities?: Record<string, AnyEntity>) {
  if (!entities) return;

  const tree = _entityTree(entities);

  let id = 0;
  const root: RootNode = {
    kind: 'root',
    id: id++,
    height: 0,
    childNodes: [],
  };

  for (const [category, subCategories] of tree.entries()) {
    const categoryNode: CategoryNode = {
      kind: 'category',
      id: id++,
      title: category,
      height: categoryHeight,
      isSticky: true,
      stickyTop: 0,
      zIndex: 200,
      childNodes: [],
    };

    for (const [subCategory, entities] of subCategories.entries()) {
      const subCategoryNode: SubCategoryNode = {
        kind: 'subCategory',
        id: id++,
        title: subCategory,
        height: subCategoryHeight,
        isSticky: true,
        stickyTop: categoryHeight,
        zIndex: 100,
        childNodes: [],
      };

      for (const entity of entities) {
        const entityNode: EntityNode = {
          kind: 'entity',
          id: id++,
          height: entityHeight,
          entity,
        };

        subCategoryNode.childNodes.push(entityNode);
      }

      categoryNode.childNodes.push(subCategoryNode);
    }

    root.childNodes.push(categoryNode);
  }

  return root;
}

function _entityTree(entities: Record<string, AnyEntity>) {
  const allEntities = Object.values(entities);
  const indexed: EntityTree = new Map();
  for (const entity of allEntities.sort(
    (a, b) =>
      (a.listOrder || Number.MAX_SAFE_INTEGER) -
      (b.listOrder || Number.MAX_SAFE_INTEGER),
  )) {
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

function _filterTree(tree?: RootNode, filterText?: string) {
  if (!filterText || !tree) return tree;

  const filter = _compileFilter(filterText);

  const newCategories = [] as CategoryNode[];
  for (const category of tree.childNodes) {
    const newSubCategories = [] as SubCategoryNode[];
    for (const subCategory of category.childNodes) {
      const newEntities = subCategory.childNodes.filter(({ entity }) =>
        filter.test(entity.name),
      );

      if (!newEntities.length) continue;
      newSubCategories.push({ ...subCategory, childNodes: newEntities });
    }

    if (!newSubCategories.length) continue;
    newCategories.push({ ...category, childNodes: newSubCategories });
  }

  return { ...tree, childNodes: newCategories };
}

function _compileFilter(filterText: string) {
  const source = filterText
    .toLowerCase()
    .split('')
    .join('.*');
  return new RegExp(source, 'i');
}

function _findId(tree?: RootNode, selectedSlug?: string) {
  if (!tree || !selectedSlug) return;

  for (const category of tree.childNodes) {
    for (const subCategory of category.childNodes) {
      for (const { id, entity } of subCategory.childNodes) {
        if (entity.slug === selectedSlug) return id;
      }
    }
  }
}

function _findAdjacentEntityIndex(
  tree: AutoSizedStickyTree<AnyNode>,
  currentId: NodeId,
  direction: 'up' | 'down',
) {
  const currentNode = tree.nodes[tree.getNodeIndex(currentId)];
  if (!currentNode) return tree.nodes.findIndex(n => n.kind === 'entity');

  const move = direction === 'down' ? 'getNextNodeId' : 'getPreviousNodeId';
  while (true) {
    const newId = tree[move](currentId);
    if (newId === undefined) return;

    const newIndex = tree.getNodeIndex(newId);
    if (tree.nodes[newIndex].kind === 'entity') {
      return newIndex;
    } else {
      currentId = newId;
    }
  }
}
