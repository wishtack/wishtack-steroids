
describe('ChangeDetector', function () {

    beforeEach(() => {

        const module = angular.module('wishtack.steroids.testing', []);

        class UserComponent {

            static config = {
                bindings: <any>{
                    user: '<wtUser'
                },
                controller: UserComponent,
                template: `
<span>{{ $ctrl.user.firstName }}</span>
<span>{{ $ctrl.user.lastName }}</span>
`
            }

        }

        module.component('wtUser', UserComponent.config);

    });

    beforeEach(angular.mock.module('wishtack.steroids.testing'));

    xit('should enable watchers only when the components\' inputs change', () => {

    });

    xit('should not watch local changes except if markForCheck is called', () => {

    });

});
