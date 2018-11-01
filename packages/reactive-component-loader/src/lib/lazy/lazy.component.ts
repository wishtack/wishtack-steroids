import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ComponentLocation, ComponentRecipe, ReactiveComponentLoader } from '../reactive-component-loader.service';

@Component({
    selector: 'wt-lazy',
    templateUrl: './lazy.component.html'
})
export class LazyComponent implements OnChanges {

    @Input() location: ComponentLocation;
    @Input() inputs: { [key: string]: any };
    @Input() outputs: { [key: string]: (...args) => void };

    componentRecipe$: Observable<ComponentRecipe<any>>;

    constructor(private _dynamicComponentLoader: ReactiveComponentLoader) {
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.location != null) {
            this.componentRecipe$ = this._dynamicComponentLoader.getComponentRecipe(this.location);
        }

    }

}
