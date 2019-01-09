# `@wishtack/get`

`@wishtack/get` is a TypeScript typed functional alternative to Optional Chaining Operator (a.k.a. Safe Navigation Operator).
 * Cf. https://github.com/Microsoft/TypeScript/issues/16
 * Cf. https://github.com/tc39/proposal-optional-chaining

## Installation

```shell
yarn add @wishtack/get
```
or
```shell
npm install --save @wishtack/get
```

## Usage

```typescript
import { get } from '@wishtack/get';

interface User {
    name: string;
    address?: {
        postalCode: string;
        street: string;
    };
}

const user: User = {
    name: 'Foo BAR'
};

get(user, 'address', 'postalCode'); // -> undefined

get(user, 'address', 'code'); // -> Compile time error

// playground.ts: - error TS2345: Argument of type '"code"' is not assignable to parameter of type '"postalCode" | "street"'.
//
// console.log(get(user, 'address', 'code'));
//                                 ~~~~~~~~

```

## Enjoy type inference and get auto-completion for free

<p align="center">
    <img src="https://github.com/wishtack/wishtack-steroids/raw/master/packages/get/get-auto-completion.png" alt="@wishtack/get auto completion">
</p>
