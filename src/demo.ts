// 序列化终止条件 : 1. 层数. 2. id
/**
 * @import {Serializable, WalkerNode} from "type"
 */

const abc = {
  a: "abc",
  d: function() {
    
  },
  1: "a",
  ad: [{as: "2"}],
  c: Symbol("a")
}

interface SomeModel {
  id: string,
  value: string,
  test: string,
}


/** @type {Serializable<typeof abc>} */
const abc_serializable = {
  serialize: () => JSON.stringify("abc"), 
  deSerialize: () => JSON.parse("abc"),
}


JSON.stringify(abc, [1], " ")
