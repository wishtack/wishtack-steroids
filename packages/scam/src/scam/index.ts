import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import moduleSchematic from '@schematics/angular/module';
import { Schema as ModuleOptions } from '@schematics/angular/module/schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function scam(_options: ModuleOptions): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        console.log(moduleSchematic);
        return tree;
    };
}
