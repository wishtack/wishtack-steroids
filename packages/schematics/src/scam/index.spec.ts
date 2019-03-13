import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';



describe('scam', () => {

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

    it('should create a module with a component in the same directory', () => {

        const runner = new SchematicTestRunner('schematics', collectionPath);

        const tree = runner.runSchematic('scam', {
            name: 'hello-world',
            project: 'wishtack'
        }, appTree);

        expect(tree.files).toContain('/projects/wishtack/src/app/hello-world/hello-world.module.ts');
        expect(tree.files).toContain('/projects/wishtack/src/app/hello-world/hello-world.component.ts');

        const moduleContent = tree.readContent('/projects/wishtack/src/app/hello-world/hello-world.module.ts');
        expect(moduleContent).toMatch(/import.*HelloWorldComponent.*from '.\/hello-world.component'/);
        expect(moduleContent).toMatch(/declarations:\s*\[HelloWorldComponent\]/m);
        expect(moduleContent).toMatch(/exports:\s*\[\s*HelloWorldComponent\]/m);

    });

});
