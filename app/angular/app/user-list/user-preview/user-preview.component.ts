/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

export class UserPreviewComponent {

    static config = {
        bindings: <any>{
            onUserRemove: '&wtOnUserRemove',
            user: '<wtUser'
        },
        controller: UserPreviewComponent,
        templateUrl: require('./user-preview.component.html')
    };

    user;

}
