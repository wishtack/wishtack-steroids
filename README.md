# Boost your AngularJS app with ngSteroids

[![Greenkeeper badge](https://badges.greenkeeper.io/wishtack/ng-steroids.svg)](https://greenkeeper.io/)

## Angular 2 Change Detector for AngularJS 1.5.x

The idea here is to benefit from the [Angular 2 `OnPush` mode](http://blog.thoughtram.io/angular/2016/02/22/angular-2-change-detection-explained.html) in AngularJS. 

Suppose you have a component like this one:

```TypeScript
class UserPreviewComponent {
    
    config = {
        bindings: {
            user: '<'
        },
        controller: UserPreviewComponent,
        template: `<div>{{ $ctrl.user.firstName }}</div>`
    }
    
}

const module = angular.module('...', []);

module.component('userPreview', UserPreviewComponent.config);

```

That we use like this:

```html

<div ng-repeat="user in $ctrl.userList">
    <user-preview user="user"></user-preview>
</div>

```

The classical problem is that we'll end up with `2 * N + 1` watchers where N is the user count.
And if we had 10 watchers per component, we would end up with `11 * N + 1` watchers.

Luckily, we have [one-time-binding](http://www.blog.wishtack.com/single-post/2015/03/02/AngularJS-Performance-ngrepeat-Performance-and-Optional-one-time-binding) and we can one-time-bind everything and end up with 0 watchers. But what if users can be updated? Are we forced to watch everything?
What about enabling the watch explicitly per component only when the user reference changes (not it's properties)... YES ! Immutability !

Using the `ng-steroids-change-detector` module you can implement this behaviour as if you were already using Angular 2.

## Install

```npm install --save-dev ng-steroids-change-detector```

## Usage

1 - Add the `dist/change-detector.min.js` to your app or if `import` it if you are using webpack.

2 - Add the AngularJS module dependency to your modules:

```TypeScript
angular.module('...', [
    'wishtack.steroids.changeDetector'
])
```

3 - Inject the `ChangeDetector` in your component.

```TypeScript
class UserPreviewComponent {
    
    config = {
        bindings: {
            user: '<'
        },
        controller: UserPreviewComponent,
        template: `<div>{{ $ctrl.user.firstName }}</div>`
    }
    
    private _changeDetector;
    
    constructor($scope, ChangeDetector) {
        'ngInject';
        
        this._changeDetector = new ChangeDetector({scope: $scope});
        
    }
    
}

```

This will automatically disable the component's watchers except if the reference to the `user` input changes.

4 - Changes can also be triggered manually using:

```TypeScript
this._changeDetector.markForCheck();
```
