# Walker Common

<a href=""><img alt="GitHub User's stars" src="https://img.shields.io/github/stars/yymm120/walker-common">
</a>

A walker util for retrive tree data structure.

> Note: Still in experimental beta version, please do not use in production environment.

## Usage

#### 1. walkEach: Retrive all tree node.

```js
import { Walker } from "walker-common";

const root = Walker.root(tree);
root.walkEach((node) => {
  console.log(node);
});
```

#### 2. stream

```js
const data = Walker.root({a: "123" ,b: "sso", children: [{a: "sss", b: "231"}]}, { algorithm: Walker.Algorithm.DFS_PreOrder })
  .stream()
  .map((node) => ({...node, c: "def"}))
  .map((node) => ({...node, el: `<button>${node.a}</button>`}))
  .pick(["a", "b", "el"])
  .collect()

/**
{
  a: "123",
  b: "sso",
  el: "<button>123</button>",
  children: [
    {
      a: "sss",
      b: "231",
      el: "<button>sss</button>",
    }
  ],
}
*/
```



