# Walker Common

a walker util for retriver Tree data structure.

## Usage

```js
import { Walker } from "walker-common";

const root = Walker.root(tree);
root.walkEach((node) => {
    console.log(node);
});
```