
[![Build Status](https://travis-ci.org/wishtack/wishtack-steroids.svg?branch=master)](https://travis-ci.org/wishtack/wishtack-steroids)
[![Greenkeeper badge](https://badges.greenkeeper.io/wishtack/wishtack-steroids.svg)](https://greenkeeper.io/)

# What is Reactive Component Loader?

`@wishtack/reactive-component-loader` is an Angular module that allows:
- **declarative** dynamic **component insertion**,
- **component lazy loading** and not only with the router *(even with AOT enabled)*,
- **passing @Inputs and @Outputs** easily to the dynamically inserted component (using [ng-dynamic-component](https://github.com/gund/ng-dynamic-component)).

# Getting Started

## 1. Install

```shell
yarn add @wishtack/reactive-component-loader
```

or `npm install --save @wishtack/reactive-component-loader`

## 2. Setup

Add `ReactiveComponentLoaderModule.forRoot()` to the root module.

```typescript
@NgModule({
    ...
    imports: [
        ReactiveComponentLoaderModule.forRoot()
    ]
    ...
})
export class AppModule {
}
```

## 3. Declare lazy loaded modules

```typescript
@NgModule({
    ...
    imports: [
        ReactiveComponentLoaderModule.withModule({
            moduleId: 'todo-form-v1',
            loadChildren: './+todo-form-v1/todo-form-v1.module#TodoFormV1Module'
        }),
        ReactiveComponentLoaderModule.withModule({
            moduleId: 'todo-form-v2',
            loadChildren: './+todo-form-v2/todo-form-v2.module#TodoFormV2Module'
        }),
    ]
    ...
})
export class TodoListModule {
}
```

## 4. Lazy load components

### Using `<wt-lazy>`...

```typescript

@Component({
    template: `
    <wt-lazy
        [location]="todoFormComponentLocation"
        [inputs]="{keywords: keywords}
        [outputs]="{keywordsChange: onKeywordsChange}">
    `
})
export class SomeFeatureComponent {
    
    todoFormComponentLocation = {
        moduleId: 'todo-form-v1',
        selector: 'wt-todo-form-v1'
    };
    
    onKeywordsChange = (keywords: string) => {
        ...
    }
    
}

```

### ... or `ngComponentOutlet`

```typescript
@Component({
    template: `
    <ng-container *ngIf="todoFormComponentRecipe$ | async as recipe">
        <ng-container *ngComponentOutlet="recipe.componentType; ngModuleFactory: recipe.ngModuleFactory"
    </ng-container>
    `
})
export class SomeFeatureComponent {
    
    todoFormComponentRecipe$ = this._reactiveComponentLoader.getComponentRecipe({
        moduleId: 'todo-form-v1',
        selector: 'wt-todo-form-v1'
    });
    
    constructor(private _reactiveComponentLoader: ReactiveComponentLoader) {
    }
    
}

```
