/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

import { NgModuleFactoryLoader } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule, SpyNgModuleFactoryLoader } from '@angular/router/testing';
import { GreetingsComponent, GreetingsModule } from '../fixtures/greetings.module';
import { ReactiveComponentLoaderModule } from './reactive-component-loader.module';
import { ReactiveComponentLoader } from './reactive-component-loader.service';


describe('ReactiveComponentLoader', () => {

    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            ReactiveComponentLoaderModule.declareModule({
                moduleId: 'greetings',
                modulePath: './path/to/greetings.module#GreetingsModule'
            }),
            RouterTestingModule
        ]
    }));

    let spyNgModuleFactoryLoader: SpyNgModuleFactoryLoader;
    beforeEach(() => spyNgModuleFactoryLoader = TestBed.get(NgModuleFactoryLoader));

    let reactiveComponentLoader: ReactiveComponentLoader;
    beforeEach(() => reactiveComponentLoader = TestBed.get(ReactiveComponentLoader));

    beforeEach(() => {
        /* Stubbing the lazy loaded module. */
        spyNgModuleFactoryLoader.stubbedModules = {
            './path/to/greetings.module#GreetingsModule': GreetingsModule
        };
    });

    it('should retrieve component recipe', async () => {

        /* Retrieving the component's recipe using its location. */
        const recipe = await reactiveComponentLoader.getComponentRecipe({
            moduleId: 'greetings',
            selector: 'wt-greetings'
        }).toPromise();

        /* Check that we retrieved the right component type. */
        expect(recipe.componentType).toBe(GreetingsComponent);

        /* Create the component... */
        const fixture = TestBed.createComponent(recipe.componentType);

        /* ... and see if it works. */
        fixture.componentInstance.name = '@yjaaidi';
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toEqual('Hello @yjaaidi');

    });

    it('should throw an error if module is not found', fakeAsync(() => {

        const error = jasmine.createSpy('error');
        const next = jasmine.createSpy('next');

        reactiveComponentLoader.getComponentRecipe({
            moduleId: 'unknown-module-id',
            selector: 'wt-greetings'
        })
            .subscribe({next, error});

        tick();

        expect(next).not.toHaveBeenCalled();
        expect(error).toHaveBeenCalledWith(new Error(`Module with id 'unknown-module-id' not found.`));

    }));

    it('should throw an error if component is not found', fakeAsync(() => {

        const error = jasmine.createSpy('error');
        const next = jasmine.createSpy('next');

        reactiveComponentLoader.getComponentRecipe({
            moduleId: 'greetings',
            selector: 'wt-unknown-component'
        })
            .subscribe({next, error});

        tick();

        expect(next).not.toHaveBeenCalled();
        expect(error).toHaveBeenCalledWith(new Error(`Component '<wt-unknown-component>' not found.`));

    }));

});
