# Responsive Values

ResponsiveValues is a library for operations on responsive values and/or arrays of responsive values.

## Usage

The library is very simple to use. All you have to do is import the lib, pass the arguments and call the desired module. Just like this:

```typescript
import rv from 'responsive-values';

rv([10, null, 30, 20], [6, null, 44, 8, 5, 99]).sum(); // [16, 74, null, 28, 25, 119]
rv([{ a: 1, b: 2}, { d: 5, z: null }, { d: 8, z: 3 }, null, { a: 1, c: 3, d: 8}]).maxValueKey(); // ['b', 'd', null, null, 'd']
rv(10, [true, null, false, true, false]).getContainerWidth(); // ['100%', 'calc(100% - 5px)', null, '100%', 'calc(100% - 5px)']
```

## Modules

There are three default modules: `sum`, `maxValueKey`, `getContainerWidth`. You can easily create your own modules. To create your own module use the following template:

```typescript
import { ResponsiveValue } from 'responsive-values';

function dummyModule(params) {
    return function dummyModule(params: { [key: string]: string }) {
        return function reverseAndCompress(this: ResponsiveValues, args: ResponsiveValue[]) {
            // modify passed arguments here, reverse and compress are just examples
            if (params.reverse) {
                return this.compress(args.reverse());
            }

            return this.compress(args);
        }
    }
}
```

To register a module created this way, just use the `registerModule` method:

```typescript
import rv from 'responsive-values';

rv.registerModule({ dummyModule });
```

From now you can use your module just like any other:

```typescript
import rv from 'responsive-values';

rv([1, 2, 2, 3]).dummyModule({ reverse: true }); // [3, 2, null, 1]
```

As you can see, a library instance is passed to the module in `this` object. It provides a few helpers such as:

`unifyArraysLength<T extends ResponsiveValue[][]>(arraysToUnify: T): T` - Takes unlimited number of arrays and returns an array of these arrays with unified length. Missing places are filled by null.

`compress<T extends ResponsiveValue[]>(responsive: T): T` - Replaces duplicated values with nulls and removes unnecessary nulls.

`fillGaps<T extends ResponsiveValue[]>(responsive: T): T` - Gets an array of responsive values and replaces null / undefined values with the nearest neighbour.


You can also pass any arguments to the module, similar to the `params` argument.

## Instance

To get an instance of the library just call the function `rv.getInstance()`.

## Build project

```
npm run build
```

## Tests

```
npm run test
```