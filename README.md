# Walker Common

a walker util for retriver Tree data structure.

## Usage

#### 1. walkEach: Retrive all tree node.

```js
import { Walker } from "walker-common";

const root = Walker.root(tree);
root.walkEach((node) => {
  console.log(node);
});
```

#### 2. stream().map: pipe map

```js
import { Walker } from "walker-common";

const root = Walker.root({ id: 001, name: "allen" });
const data = root
  .stream()
  .map((node) => {
    return { ...node, age: 18 };
  })
  .map((node) => {
    return { ...node, country: "-" };
  })
  .collect();
```


#### Example - React
```js
import { Walker } from "walker-common";

const root = Walker.root();
const MenuComponent = () => {
    return (
        <>
        {
            root.stream().map((node, depth, tree) => {
                if (depth === 1) {
                    return <li><button>{node.value}</button></li>
                } else {
                    return <ul><p>{node.value}</p></ul>
                }
            }).collect()
        }
        </>
    )
}
```