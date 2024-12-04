/**
 * @import { WalkEach, TData, WalkerOptions } from "type";
 */
import Walker from "./walker";
import { WALKER_OPTIONS_DEFAULT } from "./walker-options";
import { WalkerStream } from "./walker-stream";

export const VAL = Symbol.for("walker-node-tree");

export const NODE_DEFAULT = Object.assign(
  {},
  {
    appendChild,
    walkEach,
    stream,
    getParentNode,
    getChildrenNode,
    toString,
  }
);

/**
 * Append a child node into `this[VAL]`
 *
 * @todo `this[VAL].children` need change to `this.setChildren([...this.getChildren, node[VAL]])`
 *
 * @param {import("type").WalkerNode<any>} node
 * @this {import("type").WalkerNode<any>}
 */
function appendChild(node) {
  node[VAL].parent = this[VAL];
  if (this[VAL].children && this.getChildrenNode().length !== 0) {
    this[VAL].children.push(node[VAL]);
  } else {
    this[VAL].children = [node[VAL]];
  }
}

/**
 * Print the tree data structure.
 *
 * @this {import("type").WalkerNode<any>}
 */
function toString() {
  const { parent, ...fields } = this[VAL];
  // @ts-ignore
  return JSON.stringify(
    {
      ...this[VAL],
    },
    Object.keys(fields),
    "  "
  );
}

/**
 * A forEach function for retrive all node in the tree. it is simulate with `Array.forEach()`.
 *
 * @type {WalkEach<any>}
 * @this {import("type").WalkerNode<any>}
 */
function walkEach(handle, options) {
  const queue = [{ node: this, depth: 1 }];
  while (queue.length > 0) {
    const { node, depth = 1 } = queue.shift() ?? {};
    if (node) {
      handle(node[VAL], depth);
      const children = node?.getChildrenNode();
      if (children?.length > 0) {
        queue.unshift(...node.getChildrenNode().map(n => ({ node: n, depth: depth + 1 })));
      }
    }
  }
}

/**
 * 
 * @this {import("type").WalkerNode<any>}
 */
function stream() {
    return new WalkerStream(this)
}

/**
 * Get parent walker node of `this`. This will execute `Walker.createNode()` to create new Node.
 *
 * @this {import("type").WalkerNode<any>}
 */
function getParentNode(options = WALKER_OPTIONS_DEFAULT) {
  const parent = options.getParent(this[VAL]);
  if (parent) {
    return Walker.createNode(parent, options);
  }
}

/**
 * Get children walker node of `this`. This will execute `Walker.createNode()` to create new Node.
 *
 * @this {import("type").WalkerNode<TData | any>}
 * @returns {import("type").WalkerNode<TData | any>[]}
 */
function getChildrenNode(options = WALKER_OPTIONS_DEFAULT) {
  const children = options.getChildren(this[VAL]);
  if (Array.isArray(children)) {
    return children.map((val) => Walker.createNode(val, options));
  } else {
    // @ts-ignore
    return children
      ? [children].map((val) => Walker.createNode(val, options))
      : [];
  }
}

export class WalkerNode {
  /**
   * @param {any} val
   * @param {WalkerOptions} options
   * @this {import("type").WalkerNode<any>}
   */
  constructor(val, options = WALKER_OPTIONS_DEFAULT) {
    this[VAL] = val;

    Object.assign(this, { ...NODE_DEFAULT, ...options });
    // Node
    this.getChildrenNode = getChildrenNode.bind(this, options);
    this.getParentNode = getParentNode.bind(this, options);
    this.walkerOptions = options;
  }
}
