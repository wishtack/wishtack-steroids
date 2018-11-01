import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { ReactiveComponentLoaderModule } from '../lib';

@Component({
    selector: 'wt-greetings',
    template: `
        <div>Hello {{ name }}</div>`
})
export class GreetingsComponent {
    @Input() name: string;
}

@NgModule({
    declarations: [
        GreetingsComponent
    ],
    entryComponents: [
        GreetingsComponent
    ],
    exports: [
        GreetingsComponent
    ],
    imports: [
        CommonModule,
        ReactiveComponentLoaderModule
    ]
})
export class GreetingsModule {
}