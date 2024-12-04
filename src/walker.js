/**
 * @import {  RootFn } from "type";
 */

import { WalkerNode } from "./walker-node";

export default class Walker {
  static #Node = WalkerNode;
  // static #WalkerStream = WalkerStream

  /** @type { RootFn } */
  static root = (node, options = {}) => {
    return this.#Node.createNode(node, options);
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

