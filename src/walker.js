/**
 * @import {  RootFn } from "type";
 */

import { WalkerNode } from "./walker-node";
import { WALKER_OPTIONS_DEFAULT } from "./walker-options";
import { WalkerStream } from "./walker-stream";

export default class Walker {
  static #Node = WalkerNode;
  static #WalkerStream = WalkerStream

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


// const data = { id: 1, children: [ {id: 2}, {id: 3}]}

// const a = Walker.root(data).stream().map(({id, ...other}, depth) => {
//   const div = `<div id="${id}"></div>`;
//   return { div: div, ...other }
// }).map(({div, ...other}) => {
//   console.log(div)
//   return { sds: "asdsd", ...other }
// }).collect()

