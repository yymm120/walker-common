/**
 * @import { WalkEach, TData, WalkerOptions, RootFn } from "type";
 */
import { VAL, walk, WALKER_OPTIONS_DEFAULT } from "./common";
import { WalkerStream } from "./walker-stream";


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
  for (const node of walk(this, options, {})) {
    const {walkerNode, depth } = node;
    handle(walkerNode[VAL], depth);
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
    return WalkerNode.createNode(parent, options);
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
    return children.map((val) => WalkerNode.createNode(val, options));
  } else {
    // @ts-ignore
    return children
      ? [children].map((val) => WalkerNode.createNode(val, options))
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

    /** @type { RootFn } */
  static createEmptyNode = (node, options = {}) => {
    const walkerOptions = { ...WALKER_OPTIONS_DEFAULT, ...options };
    // @ts-ignore
    return new WalkerNode(node, walkerOptions);
  };

  /** @type { RootFn } */
  static createNode = (node, options = {}) => {
    const walkerOptions = { ...WALKER_OPTIONS_DEFAULT, ...options };
    if (node instanceof Object) {
      if ("children" in node) {
        node.children = walkerOptions.getChildren(node);
        if (Array.isArray(node.children) && node.children.length > 0) {
          for (const child of node.children) {
            child.parent = node;
          }
        }
      }
      if ("parent" in node) {
        node.parent = walkerOptions.getParent(node);
        if (node.parent instanceof Object) {
          if (
            "children" in node.parent &&
            Array.isArray(node.parent?.children)
          ) {
            if (
              !node.parent.children.find((item, i, arr) => {
                if (item === node) {
                  return true;
                } else {
                  const { parent, children, ...value } = item;
                  const isFind = Object.keys(value).reduce((pre, cur) => {
                    // @ts-ignore
                    return pre && value[cur] === node[cur];
                  }, true);
                  if (isFind) {
                    arr[i] = node;
                  }
                  return isFind;
                }
              })
            ) {
              node.parent.children.push(node);
            }
          } else {
            Object.assign(node.parent, { children: [node] });
          }
        }
      }
    }
    const walkerNode = new WalkerNode(node, walkerOptions);
    // @ts-ignore
    return walkerNode;
  };

  /** @type { RootFn } */
  static root = (node, options = {}) => {
    // @ts-ignore
    return this.createNode(node, options);
  };
}
