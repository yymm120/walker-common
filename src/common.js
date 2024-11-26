/**
 * 以"浅拷贝"的方式从object中提取属性, 并返回一个新的对象.
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
