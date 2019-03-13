import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';


const collectionPath = path.join(__dirname, '../collection.json');


describe('scam', () => {

    xit('should create a module with a component in the same directory', () => {

        const runner = new SchematicTestRunner('schematics', collectionPath);

        const tree = runner.runSchematic('scam', {
            name: 'hello-world'
        }, Tree.empty());

        expect(tree.files).toContain('/hello-world/hello-world.component.ts');
        expect(tree.files).toContain('/hello-world/hello-world.module.ts');

    });

});
