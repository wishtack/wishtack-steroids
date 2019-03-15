import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { _mergeComponentAndModule } from './index';

describe('scam', () => {

    describe('schematic', () => {

        const collectionPath = path.join(__dirname, '../collection.json');

        let appTree: Tree;

        beforeEach(() => {

            const workspaceOptions = {
                name: 'workspace',
                newProjectRoot: 'projects',
                version: '6.0.0',
            };

            const appOptions = {
                name: 'wishtack',
                inlineStyle: false,
                inlineTemplate: false,
                routing: false,
                skipTests: false,
                skipPackageJson: false,
            };
            const schematicRunner = new SchematicTestRunner(
                '@schematics/angular',
                require.resolve('@schematics/angular/collection.json'),
            );
            appTree = schematicRunner.runSchematic('workspace', workspaceOptions);
            appTree = schematicRunner.runSchematic('application', appOptions, appTree);

        });

        it(`WIP: should create module in the component's file`, () => {

            const runner = new SchematicTestRunner('schematics', collectionPath);

            const tree = runner.runSchematic('scam', {
                name: 'hello-world',
                project: 'wishtack'
            }, appTree);

            expect(tree.files).toContain('/projects/wishtack/src/app/hello-world/hello-world.component.ts');
            expect(tree.files).not.toContain('/projects/wishtack/src/app/hello-world/hello-world.module.ts');

            const component = tree.readContent('/projects/wishtack/src/app/hello-world/hello-world.component.ts');
            expect(component).toMatch(/export class HelloWorldComponent/);
            // @todo: expect(component).toMatch(/exports:\s*\[\s*HelloWorldComponent]/m);

        });

        it('should create a module with a component in the same directory', () => {

            const runner = new SchematicTestRunner('schematics', collectionPath);

            const tree = runner.runSchematic('scam', {
                name: 'views/hello-world',
                project: 'wishtack',
                separateModule: true
            }, appTree);

            expect(tree.files).toContain('/projects/wishtack/src/app/views/hello-world/hello-world.module.ts');
            expect(tree.files).toContain('/projects/wishtack/src/app/views/hello-world/hello-world.component.ts');

            const moduleContent = tree
                .readContent('/projects/wishtack/src/app/views/hello-world/hello-world.module.ts');
            expect(moduleContent).toMatch(/import.*HelloWorldComponent.*from '.\/hello-world.component'/);
            expect(moduleContent).toMatch(/declarations:\s*\[HelloWorldComponent]/m);
            expect(moduleContent).toMatch(/exports:\s*\[\s*HelloWorldComponent]/m);

        });

    });

    describe('_mergeComponentAndModule', () => {

        const componentContent = `import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.css']
})
export class HelloWorldComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
`;
        const moduleContent = `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelloWorldComponent } from './hello-world.component';

@NgModule({
  declarations: [HelloWorldComponent],
  imports: [
    CommonModule
  ],
  exports: [HelloWorldComponent]
})
export class HelloWorldModule { }
`;


        it('should merge component and module', () => {

            const expectedContent = `import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.css']
})
export class HelloWorldComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

@NgModule({
  declarations: [HelloWorldComponent],
  imports: [
    CommonModule
  ],
  exports: [HelloWorldComponent]
})
export class HelloWorldModule { }
`;

            const result = _mergeComponentAndModule(componentContent, moduleContent);

            const lineList = result.split('\n')
                .map(line => line.trim());

            // @todo: expect(lineList).toContain(`import { Component, NgModule, OnInit } from '@angular/core';`);
            expect(lineList).toContain(`import { CommonModule } from '@angular/common';`);
            expect(lineList).not.toContain(`import { NgModule } from '@angular/core';`);
            expect(lineList).not.toContain(`import { HelloWorldComponent } from './hello-world.component';`);
            expect(lineList).toContain('declarations: [HelloWorldComponent],');
            expect(lineList).toContain('exports: [HelloWorldComponent]');

            // @todo: expect(result).toEqual(expectedContent);

        });

    });

});

