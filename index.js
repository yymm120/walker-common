// interface WalkerNode<T> {
//   val?: T,
//   parent?: WalkerNode<T>,
//   children?: Array<WalkerNode<T>>,
// }

// interface Walker {
//   objectPick: <T>(object: T, pick: Partial<T>) => typeof pick;
// }

const node0 = { id: "000", obj: { id: "obj_000" }, parent: null, children: [] };
const node1 = {
  id: "001",
  obj: { id: "obj_001" },
  parent: null,
  children: [node0],
};
const node2 = {
  id: "002",
  obj: { id: "obj_002" },
  parent: 2,
  children: [node1],
};
const node3 = {
  id: "003",
  obj: { id: "001", obj2: { obj3: { id: "004" } } },
  parent: 2,
  children: [node2],
};

const root = Walker.root(
  Walker.objectPick(
    { id: "string", value: "string" },
    {
      id: node3.id,
    }
  )
);

console.log(root);
// console.log(root.toString());
// root.walkEach((a) => console.log(a));
// const waker = Walker(root)
//   handle: ( node, {depth, ok, err}) => {
//     if (depth > 3) {
//         return ok()
//     }
//     node.obj.id
//     console.log(node)
//     return ok(node);
//   }
// }
