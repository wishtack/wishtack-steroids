/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

import { Component, Input, NgModuleFactoryLoader } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule, SpyNgModuleFactoryLoader } from '@angular/router/testing';
import { GreetingsModule } from '../../fixtures/greetings.module';
import { ReactiveComponentLoaderModule } from '../reactive-component-loader.module';
import { ComponentLocation } from '../reactive-component-loader.service';

@Component({
    template: `
        <ng-container *wtLazy="location; inputs: inputs; outputs: outputs"></ng-container>
    `
})
export class TestContainerComponent {
    @Input() location: ComponentLocation;
    @Input() inputs: {[key: string]: any};
    @Input() outputs: {[key: string]: (event: any) => void};
}

xdescribe('[wtLazy] directive', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TestContainerComponent
            ],
            imports: [
                ReactiveComponentLoaderModule.withModule({
                    moduleId: 'greetings',
                    loadChildren: './path/to/greetings.module#GreetingsModule'
                }),
                RouterTestingModule
            ]
        })
            .compileComponents();
    }));

    let spyNgModuleFactoryLoader: SpyNgModuleFactoryLoader;
    beforeEach(() => spyNgModuleFactoryLoader = TestBed.get(NgModuleFactoryLoader));

    beforeEach(() => {
        /* Stubbing the lazy loaded module. */
        spyNgModuleFactoryLoader.stubbedModules = {
            './path/to/greetings.module#GreetingsModule': GreetingsModule
        };
    });

    let component: TestContainerComponent;
    let fixture: ComponentFixture<TestContainerComponent>;
    beforeEach(() => {
        fixture = TestBed.createComponent(TestContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should lazy load component', fakeAsync(() => {

        component.inputs = {
            name: '@yjaaidi'
        };
        component.location = {
            moduleId: 'greetings',
            selector: 'wt-greetings'
        };

        /* Propagate inputs to `<wt-lazy>`. */
        fixture.detectChanges();

        /* Trigger `ReactiveComponentLoader.getComponentRecipe`'s observer. */
        tick();

        /* Trigger change now that the component's recipe has been received. */
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toEqual('Hello @yjaaidi');

    }));

});
