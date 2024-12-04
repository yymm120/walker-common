// import Walker from "./src/walker";

export type TreeNode = unknown;
export type TreeRoot = TreeNode;
export interface WalkfFn {
    (root: TreeRoot, options: WalkerOptions) : unknown
}

export enum Algorithm {
  /** depth-first search and preorder traversal, default is left to right */
  DFS_PreOrder = "DFS_PreOrder",
  /** depth-first search and inorder traversal, default is left to right */
  DFS_InOrder = "DFS_InOrder",
  /** depth-first search and postorder traversal, default is left to right */
  DFS_PostOrder = "DFS_PostOrder",
  /** depth-first search and postorder traversal, default is right to left */
  DFS_PreOrder_RL = "DFS_PreOrder-RL",
  /** depth-first search and postorder traversal, default is right to left */
  DFS_InOrder_RL = "DFS_InOrder_RL",
  /** depth-first search and postorder traversal, RL means right to left */
  DFS_PostOrder_RL = "DFS_PostOrder_RL",
  /** breadth-first search and left to right*/
  BFS = "BFS",
  /** breadth-first search and right to left*/
  BFS_RL = "BFS_RL"
}


export type TData = {
    [k in string]: any
} | any

export interface WalkerOptions {
    getChildren: <T extends TData>(node: TData) => TData[];
    algorithm: Algorithm;
    getParent: <T extends TData>(node: TData) => TData | undefined;
    allowCircular: boolean;
    onWalkError: <TData>(node: TData) => void,
}


export interface Serializable<T extends {children?: T[], parent?: T}> {
    serialize: () => string;
    deSerialize: () => WalkerNode<T>
}

export class WalkerIterNode<T> implements IterableIterator<T> {
    [Symbol.iterator](): IterableIterator<T>;
    val: T;
    walkerOptions: WalkerOptions
    next(...args: [] | [undefined]): IteratorResult<T, any>;
    return?(value?: any): IteratorResult<T, any>;
    throw?(e?: any): IteratorResult<T, any>;
}


interface Streamable<T> {
    map<U>(callbackfn: (value: T, depth: number, tree: T) => U, thisArg?: any): Streamable<U>;
    pick<Key extends keyof T, U extends {[k in Key]: T[k]}>(keys?: Key[] | Key): Streamable<U>;
    pickInto<Key extends keyof T, U extends {[K in Key]: T[K]}>(key?: Key): Pick<Streamable<U>, "collect"> & { getRoot(): U[Key]};
    collect(): T;
}


export type CallbackFn<T> = (<U>(value: T, depth: number, parent: T, tree: T) => U);

export class WalkerStream<T> implements Streamable<T> {
    node: WalkerNode<T>
    fns: CallbackFn<T>[]
    resultSet: T
    map<U>(callbackfn: (value: T, depth: number, parent: T, tree: T) => NonNullable<U>, thisArg?: any): Streamable<U>;
    pick<Key extends keyof T, U extends {[k in Key]: T[k]}>(keys?: Key[] | Key): Streamable<U>;
    pickInto<Key extends keyof T, U extends {[K in Key]: T[K]}>(key?: Key): Pick<Streamable<U>, "collect"> & { getRoot(): U[Key]};
    collect(): T;
}

export class WalkerNode<T> {
    // new<T>(node: T, options: Partial<WalkerOptions>) : WalkerNode
    [VAL: symbol ]: T;
    nodeList: T[]
    walkEach: WalkEach<T>
    // onWalkError: () => void,
    // onWalkFinish: () => void,
    getParentNode: () => WalkerNode<T> | undefined
    getChildrenNode: () => WalkerNode<T>[]
    appendChild: (node: WalkerNode<T>) => void
    stream: () => WalkerStream<T>
    walkerOptions: WalkerOptions
    // getDepth: () => void,
    // getDepthNodes: () => void,
    // getLastDepthNodes: () => void,
    // getNodeCount: () => void,
    // getIter: () => void,
    // toString: () => string,

}

export interface WalkerNodeFn {
    new<T extends TData>(node: T, options: WalkerOptions) : WalkerNode<T>
}

export interface RootFn {
    <T extends TData>(node: T , options?: Partial<WalkerOptions>): WalkerNode<T>;
}


// export interface ObjectPick {
//     <T>(object: T, pick: Partial<T>): typeof pick;
// }

export type WalkerObject = { [k in string]: unknown } ;

export interface ObjectPick {
  <T extends WalkerObject>(node: { [k in keyof T] : T[k]} & { [k in string]: Object | string}, pick: T): typeof pick
}


export interface WalkEach<T> {
    (handle: WalkEachHandle<T>, options?: WalkerOptions): void
}

interface WalkEachHandle<T> {
    (node: T, depth?: number) : void
}

export default class Walker {
    static Algorithm: typeof Algorithm
    static createNode: RootFn
    static root: RootFn
}