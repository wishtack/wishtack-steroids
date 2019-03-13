import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import moduleSchematic from '@schematics/angular/module';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function scam(_options: {[key: string]: any}): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        console.log(moduleSchematic);
        return tree;
    };
}
