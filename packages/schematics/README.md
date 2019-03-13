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
    sandwich-preview.component.*
    sandwich-preview.module.ts
```

Where `sandwich-preview.module.ts` declares and exports `SandwichPreviewComponent`.
