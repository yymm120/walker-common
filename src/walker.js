/**
 * @import {  RootFn } from "type";
 */

import { Algorithm } from "./common";
import { WalkerNode } from "./walker-node";

export default class Walker {
  static #Node = WalkerNode;
  static Algorithm = Algorithm;
  // static #WalkerStream = WalkerStream

  /** @type { RootFn } */
  static root = (node, options = {}) => {
    return this.#Node.createNode(node, options);
  };
}

// const result = Walker.root(
//   {
//     id: "001",
//     label: "book",
//     icon: "ph--sum-thin",
//     menus: [
//       {
//         id: "002",
//         label: "computer",
//         icon: "ph--computer-thin",
//       },
//       {
//         id: "003",
//         label: "tablet",
//         icon: "ph--tablet-thin",
//       },
//     ],
//   },
//   { getChildren: (node) => node.menus }
// )
//   .stream()
//   .map((node) => {
//     return {}
//   })
//   .collect();

// console.log(result);
