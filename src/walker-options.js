import { Algorithm } from "./common";

/** @type {import("../type").WalkerOptions} */
export const WALKER_OPTIONS_DEFAULT = {
  lazy: "immediately",
  algorithm: Algorithm.DFS_PostOrder,
  onWalkError: (node) => {},
  getParent: (node) => "parent" in node && node.parent,
  getChildren: (node) => node?.children ?? [],
  allowCircular: false,
};