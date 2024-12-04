/**
 * @import {  CallbackFn, WalkerNode, WalkerStream as WalkerStreamType } from "type";
 */

import { VAL } from "./common";

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
   * @param {CallbackFn<T>} callbackfn 
   * @param {*} thisArg
   */
  map(callbackfn, thisArg) {
    this.fns.push(callbackfn);
    return this;
  }

  /**
   * A forEach function for retrive all node in the tree. it is simulate with `Array.forEach()`.
   *
   * @param {CallbackFn<T>} callbackfn
   */
  forEach(callbackfn) {}

  /**
   *
   * @this {import("../type").WalkerStream<any>}
   */
  static #walk = function * () {
    const queue = [this.node];
    while (queue.length > 0) {
      const node = queue.shift();
      if (node) {
        yield node[VAL];
        const children = node?.getChildrenNode();
        if (children?.length > 0) {
          queue.unshift(...node.getChildrenNode());
        }
      }
    }
  }

  /**
   * 
   * @this {import("../type").WalkerStream<T>}
   * @returns 
   */
  collect() {
    for (const node of WalkerStream.#walk.apply(this)) {
        const result = this.fns.reduce((node, callback) => {
            return callback(node, 0, this.node[VAL])
        }, node);
    }
    // return this.node;
  }
}
