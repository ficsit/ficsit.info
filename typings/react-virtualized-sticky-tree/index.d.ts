declare module 'react-virtualized-sticky-tree' {
  import * as React from 'react';

  export type NodeId = string | number;

  export type Child = RegularChild | StickyChild;

  export interface RegularChild {
    id: NodeId;
    height: number;
    isSticky?: false;
  }
  export interface StickyChild {
    id: NodeId;
    height: number;
    isSticky: true;
    stickyTop: number;
    zIndex: number;
  }

  export interface RowInfo<TChild extends Child = Child> {
    id: string;
    style: React.CSSProperties;
    nodeInfo: NodeInfo<TChild>;
  }

  export type NodeInfo<TChild extends Child = Child> = TChild & BaseNodeInfo<TChild>;
  export interface BaseNodeInfo<TChild extends Child = Child> {
    top: number;
    parentIndex: number;
    parentInfo: NodeInfo<TChild>;
    depth: number;
    height: number;
    index: number;
    isFirstChild: boolean;
    isLastChild: boolean;
  }

  export interface ScrollEvent {
    scrollTop: number;
    scrollLeft: number;
    scrollReason: 'observed' | 'requested';
  }

  export interface RowsRenderedEvent<TChild extends Child = Child> {
    overscanStartIndex: number;
    overscanStopIndex: number;
    startIndex: number;
    stopIndex: number;
    startNode: boolean;
    endNode: boolean;
    nodes: TChild[];
  }

  export interface StickyTreeProps<TChild extends Child = Child> {
    treeRef?: React.Ref<any>;

    /**
     * Returns an array of child objects that represent the children of a particular node.
     * The returned object for each child should be in the form:
     *
     * { id: 'childId', height: [number], isSticky: [true|false], stickyTop: [number], zIndex: 0 }
     *
     * Where id and height are mandatory. If isSticky is true, stickyTop and zIndex should also be returned.
     *
     * Example:
     *
     * const getChildren = (id) => {
     *    return myTree[id].children.map(childId => ({
     *      id: childId
     *      isSticky: nodeIsSticky(childId),
     *      height: myTree[childId].height,
     *      ...
     *    }))
     * }
     */
    getChildren: (childId: NodeId, parent: TChild) => TChild[];

    /**
     * Called to retrieve a row to render. The function should return a single React node.
     * The function is called with an object in the form:
     *
     * <pre>
     *     rowRenderer({ id, style, nodeInfo })
     * </pre>
     *
     * The id is the id from either the root property passed to the tree, or one returned in the getChildren call.
     */
    rowRenderer: (row: RowInfo<TChild>) => React.ReactNode;

    /**
     * An object which represents the root node in the form:
     *
     * {
     *   id: 'myRootNodeId',
     *   isSticky: true
     * }
     *
     * This will be the first node passed to rowRenderer({id: myRootNodeId, ...}). Your id might be an index in an array or map lookup.
     */
    root: TChild;

    /**
     * Lets StickyTree know how many rows above and below the visible area should be rendered, to improve performance.
     */
    overscanRowCount?: number;

    /**
     * The height of the outer container.
     */
    height?: number;

    /**
     * The width of the outer container
     */
    width?: number;

    /**
     * if true, the root node will be rendered (by calling rowRenderer() for the root id). Otherwise no root node will be rendered.
     */
    renderRoot?: boolean;

    /**
     * Sets the position of the tree to the specified scrollTop. To reset
     * this, change this to -1 or undefined
     */
    scrollTop?: number;

    /**
     * Sets the position of the tree to the specified scrollIndex. This is useful when
     * paired with onRowsRendered() which returns the startIndex and stopIndex.
     */
    scrollIndex?: number;

    /**
     * Called whenever the scrollTop position changes.
     */
    onScroll?: (event: ScrollEvent) => void;

    /**
     * Called to indicate that a new render range for rows has been rendered.
     */
    onRowsRendered?: (event: RowsRenderedEvent<TChild>) => void;

    /**
     * Specifies the default row height which will be used if the child or root object do not have a height specified.
     */
    defaultRowHeight?: number;

    /**
     * If true, all leaf nodes will be wrapped with a div, even when they are not sticky. this may help with certain tree structures where you need a constant key
     * for the element so that it is not recreated when React dom diffing occurs.
     */
    wrapAllLeafNodes?: boolean;

    /**
     * If true, we can make some assumptions about the results returned by getChildren() which improve rendering performance.
     */
    isModelImmutable?: boolean;
  }

  export class StickyTree<TChild extends Child = Child> extends React.Component<StickyTreeProps<TChild>> {
    /**
     * Returns the index of the node in a flat list tree (post-order traversal).
     *
     * @param nodeId The node index to get the index for.
     */
    getNodeIndex(nodeId: NodeId): number;

    /**
     * Returns the node that appears higher than this node (either a parent, sibling or child of the sibling above).
     * @param nodeId The node to get the previous node of.
     */
    getPreviousNodeId(nodeId: NodeId): NodeId;

    /**
     * Returns the node that appears lower than this node (sibling or sibling of the node's parent).
     * @param nodeId The node to get the next node of.
     */
    getNextNodeId(nodeId: NodeId): NodeId;

    /**
     * Returns true if the node is completely visible and is not obscured.
     * This will return false when the node is partially obscured.
     *
     * @param nodeId The id of the node to check
     * @param includeObscured if true, this method will return true for partially visible nodes.
     */
    isNodeVisible(nodeId: NodeId, includeObscured?: boolean): boolean;

    /**
     * Returns true if the node is completely visible and is not obscured, unless includeObscured is specified.
     * This will return false when the node is partially obscured, unless includeObscured is set to true.
     *
     * @param index The index of the node to check, generally retrieved via getNodeIndex()
     * @param includeObscured if true, this method will return true for partially visible nodes.
     */
    isIndexVisible(index: number, includeObscured?: boolean): boolean;

    /**
     * Sets the scrollTop position of the scrollable element.
     * @param scrollTop
     */
    setScrollTop(scrollTop: number): void;

    /**
     * Scrolls the node into view so that it is visible.
     *
     * @param nodeId The node id of the node to scroll into view.
     * @param alignToTop if true, the node will aligned to the top of viewport, or sticky parent. If false, the bottom of the node will
     * be aligned with the bottom of the viewport.
     */
    scrollNodeIntoView(nodeId: NodeId, alignToTop?: boolean): void;

    /**
     * Scrolls the node into view so that it is visible.
     *
     * @param index The index of the node.
     * @param alignToTop if true, the node will aligned to the top of viewport, or sticky parent. If false, the bottom of the node will
     * be aligned with the bottom of the viewport.
     */
    scrollIndexIntoView(index: number, alignToTop?: boolean): void;

    nodes: TChild[];
  }

  export class AutoSizedStickyTree<TChild extends Child = Child> extends StickyTree<TChild> {}
}
