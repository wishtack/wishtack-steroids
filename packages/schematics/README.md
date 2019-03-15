# Wishtack Schematics

## SCAM

SCAM stands for (Single Component Angular Module) and the term was coined by Lars Gyrup Brink Nielsen in his article about Tree-Shakable Components https://blog.angularindepth.com/angular-revisited-tree-shakable-components-and-optional-ngmodules-329a4629276d

## Installation

```sh
yarn add @wishtack/schematics 
# or npm install --save @wishtack/schematics
```

## Usage

```sh
yarn ng generate @wishtack/schematics:scam sandwich/sandwich-preview
# or npx ng generate @wishtack/schematics:scam sandwich/sandwich-preview
```

This will produce the following file tree.

```
sandwich/
  sandwich-preview/ 
    sandwich-preview.component.ts
    sandwich-preview.component.css|scss
    sandwich-preview.component.html
    sandwich-preview.component.spec.ts
```

The Angular Module (`NgModule`) is declared inside `sandwich-preview.component.ts` which is the recommended approach.
You can read why here [https://medium.com/wishtack/your-angular-module-is-a-scam-b4136ca3917b](https://medium.com/wishtack/your-angular-module-is-a-scam-b4136ca3917b) and here [https://medium.com/@alx_31836/i-am-a-huge-proponent-of-scam-and-im-definitely-using-that-name-from-now-on-cab2fe98fee3](https://medium.com/@alx_31836/i-am-a-huge-proponent-of-scam-and-im-definitely-using-that-name-from-now-on-cab2fe98fee3).

If for some reason, you want a separate file for the module, you can use the `--separate-module` option.
