/**
 * @import {  CallbackFn, WalkerNode, WalkerStream as WalkerStreamType } from "type";
 */

import { VAL, walk } from "./common";

/**
 * @template T
 * @type {WalkerStreamType<T>}
 */
export class WalkerStream {
  /**
   * @param {WalkerNode<T>} node
   */
  constructor(node) {
    this.node = node;
    /**
     * @type {CallbackFn<T>[]}
     */
    this.fns = [];
  }

  /**
   * A map function with stream feature.
   *
   * @template U
   * @param {(value: T, depth: number, tree: T) => U} callbackfn
   * @param {*} thisArg
   */
  map(callbackfn, ...thisArg) {
    // @ts-ignore
    this.fns.push(callbackfn);
    return this;
  }

  /**
   *
   * { el: {}, children: [ { el: {} } ] }
   *
   * @param {string[] | string} keys
   * @this {import("../type").WalkerStream<any>}
   */
  pick(keys) {
    keys = Array.isArray(keys)? keys : [keys];
    if (keys) {
      return this.map((value) => {
        /** @type { {[key in string] : any }} */
        let result = {};
        for (const key of keys) {
          result[key] = value[key];
        }
        return result;
      });
    } else {
      return this;
    }
  }

  /**
   *
   * [ {}, [ {}, {} ] ]
   *
   * @param {string} key
   * @this {import("../type").WalkerStream<any>}
   */
  pickInto(key) {
    if (key) {
      this.resultSet = [];
      return this.pick([key]); // { el: {}, children: [] }
    } else {
      return this;
    }
  }

  /**
   * { el: {}, children: [ { el: {} } ] }
   * [ {}, [ {}, {} ] ]
   *
   */

  /**
   * A forEach function for retrive all node in the tree. it is simulate with `Array.forEach()`.
   *
   * @param {CallbackFn<T>} callbackfn
   */
  forEach(callbackfn) {}

  /**
   *
   * @this {import("../type").WalkerStream<any>}
   * @returns
   */
  collect() {
    let resultSet = this.resultSet ?? {};
    for (const node of walk.apply(this, [
      this.node,
      this.node.walkerOptions,
      resultSet,
    ])) {
      const { walkerNode, parentNode, depth } = node;
      const value = walkerNode[VAL];
      const temp = this.fns.reduce((value, callback) => {
        return callback(
          value,
          depth,
          parentNode ? parentNode[VAL] : null,
          this.node[VAL]
        );
      }, value);

      const { children, parent, ...other } = temp;

      if (depth === 1) {
        if (Array.isArray(resultSet)) {
          node.parentSet.push(Object.values(other)[0]);
          resultSet = node.parentSet;
        } else {
          node.parentSet = other;
          resultSet = node.parentSet;
        }
      } else if (
        (node.parentSet?.children && Array.isArray(node.parentSet.children)) ||
        (node.parentSet[1] && Array.isArray(node.parentSet[1]))
      ) {
        if (Array.isArray(resultSet)) {
          node.parentSet[1].push(Object.values(other)[0]);
        } else {
          node.parentSet.children.push(other);
        }
      }

      if (walkerNode.getChildrenNode().length > 0) {
        if (Array.isArray(resultSet)) {
          node.parentSet.push([]);
        } else {
          node.parentSet.children = [];
        }
      }
    }
    return resultSet;
  }
}
