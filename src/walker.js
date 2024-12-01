/**
 * @import { Algorithm, ObjectPick, RootFn, TData, WalkerNode, WalkerNodeFn, WalkerObject, WalkerOptions } from "type";
 * @import { WalkEach } from "type";
 */

const VAL = Symbol.for("walker-node-tree");
const LIST = Symbol.for("walker-node-list");
// ************************* Walker Function **********************
/** @this {WalkerNode<any>} */
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
 * @type {WalkEach<any>}
 * @this {WalkerNode<any>}
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
function onWalkFinish() { }
function onWalkError() { }

/** @this {WalkerNode<any>} */
function getParentNode(options = WALKER_OPTIONS_DEFAULT) {
  const parent = options.getParent(this[VAL]);
  if (parent) {
    return Walker.createNode(parent, options);
  }
}

/** 
 * @this {WalkerNode<TData | any>} 
 * @returns {WalkerNode<TData | any>[]}
 */
function getChildrenNode(options = WALKER_OPTIONS_DEFAULT) {
  const children = options.getChildren(this[VAL])
  if (Array.isArray(children)) {
    return children.map((val) => Walker.createNode(val, options)
    );
  } else { // @ts-ignore
    return children ? [children].map(val => Walker.createNode(val, options)) : []
  }

}
function getDepth() { }
function getDepthNodes() { }
function getLastDepthNodes() { }
function getNodeCount() { }
function getIter() { }

let Algorithm = {};
/** @type {Algorithm.DFS_PreOrder} depth-first search and preorder traversal, default is left to right */ // @ts-ignore
Algorithm.DFS_PreOrder = "DFS_PreOrder";
/** @type {Algorithm.DFS_InOrder} depth-first search and inorder traversal, default is left to right */ // @ts-ignore
Algorithm.DFS_InOrder = "DFS_InOrder";
/** @type {Algorithm.DFS_PostOrder} depth-first search and postorder traversal, default is left to right */ // @ts-ignore
Algorithm.DFS_PostOrder = "DFS_PostOrder";
/** @type {Algorithm.DFS_PreOrder_RL} depth-first search and postorder traversal, default is right to left */ // @ts-ignore
Algorithm.DFS_PreOrder_RL = "DFS_PreOrder-RL";
/** @type {Algorithm.DFS_InOrder_RL} depth-first search and postorder traversal, default is right to left */ // @ts-ignore
Algorithm.DFS_InOrder_RL = "DFS_InOrder_RL";
/** @type {Algorithm.DFS_PostOrder_RL} depth-first search and postorder traversal, RL means right to left */ // @ts-ignore
Algorithm.DFS_PostOrder_RL = "DFS_PostOrder_RL";
/** @type {Algorithm.BFS} breadth-first search and left to right*/ // @ts-ignore
Algorithm.BFS = "BFS";
/** @type {Algorithm.BFS_RL} breadth-first search and right to left*/ // @ts-ignore
Algorithm.BFS_RL = "BFS_RL";


/** @type {WalkerOptions} */
const WALKER_OPTIONS_DEFAULT = {
  algorithm: Algorithm.DFS_PreOrder,
  onWalkError: (node) => { },
  getParent: (node) => ("parent" in node && node.parent),
  getChildren: (node) => node?.children ?? [],
  allowCircular: false,
};

/**
 * @param {WalkerNode<any>} node
 * @this {WalkerNode<any>}
 */
function appendChild(node) {
  node[VAL].parent = this[VAL];
  if (this[VAL].children && this.getChildrenNode().length !== 0) {
    this[VAL].children.push(node[VAL]);
  } else {
    this[VAL].children = [node[VAL]]
  }
}

const NODE_DEFAULT = Object.assign(
  {},
  {
    appendChild,
    walkEach,
    onWalkError,
    onWalkFinish,
    getParentNode,
    getChildrenNode,
    getDepth,
    getDepthNodes,
    getLastDepthNodes,
    getNodeCount,
    getIter,
    toString,
  }
);
export default class Walker {
  static Algorithm = Algorithm
  static #Node = class Node {
    /**
     * @param {any} val
     * @param {WalkerOptions} options
     * @this {WalkerNode<any>}
     */
    constructor(val, options = WALKER_OPTIONS_DEFAULT) {
      this[VAL] = val;

      Object.assign(this, { ...NODE_DEFAULT, ...options });
      // Node
      this.getChildrenNode = getChildrenNode.bind(this, options);
      this.getParentNode = getParentNode.bind(this, options);
    }
  };

  /** @type { RootFn } */
  static createEmptyNode = (node, options = {}) => {
    const walkerOptions = { ...WALKER_OPTIONS_DEFAULT, ...options };
    // @ts-ignore
    return new Walker.#Node(node, walkerOptions);
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
          if ("children" in node.parent && Array.isArray(node.parent?.children)) {
            if (!node.parent.children.find((item, i, arr) => {
              if (item === node) {
                return true;
              } else {
                const { parent, children, ...value } = item;
                const isFind = Object.keys(value).reduce((pre, cur) => {
                  // @ts-ignore
                  return pre && (value[cur] === node[cur]);
                }, true);
                if (isFind) {
                  arr[i] = node;
                }
                return isFind;
              }
            })) {
              node.parent.children.push(node);
            }
          } else {
            Object.assign(node.parent, { children: [node] });
          }
        }
      }
    }
    const walkerNode = new Walker.#Node(node, walkerOptions);
    // @ts-ignore
    return walkerNode;
  };

  /** @type { RootFn } */
  static root = (node, options = {}) => {
    // @ts-ignore
    return this.createNode(node, options);
  };
}


