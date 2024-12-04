export let Algorithm = {};
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

/**
 * 以"浅拷贝"的方式从object中提取属性, 并返回一个新的对象.
 * 
 * @type {import("type").ObjectPick}
 */
export function objectPick(object, pick) {
  /** @type { * }} */
  const result = {};
  const rootArr = Object.keys(pick).map((key) => ({
    obj: object,
    key: key,
    parent: undefined,
    result: result,
    pick: pick,
  }));
  const queue = rootArr;
  let count = 0;

  while (queue.length > 0) {
    const node = queue.shift();
    if (node) {
      if (Array.isArray(node.obj[node.key])) {
        // TODO: 数组内的对象目前不理会, 暂时还没想好如何处理
      } else if (typeof node.obj[node.key] === "object" && node.obj[node.key]) {
        node.result[node.key] = {};
        const childrenArr = Object.keys(node.obj[node.key]).map((key) => ({
          obj: node.obj[node.key],
          key: key,
          parent: node.key,
          result: node.result[node.key],
          pick: node.pick[node.key],
        }));
        // @ts-ignore
        queue.unshift(...childrenArr);
      }
      node.result[node.key] = node.obj[node.key] ?? node.pick[node.key];
    }

    // check
    count += 1;
    if (count === 1000) {
      count = 0;
      if (hasCircular(queue)) {
        throw new Error("please check the tree is if exist circular node.");
      }
    }
  }
  return result;
}

/** @param {Array<*>} queue @returns {boolean} */
export function hasCircular(queue) {
  const set = new Set(queue);
  if (set.size !== queue.length) {
    return true;
  }
  return false;
}

