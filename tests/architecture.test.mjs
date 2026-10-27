import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : /\.[cm]?[jt]sx?$/.test(file) ? [file] : [];
});
for (const layer of ['frontend', 'backend', 'shared']) {
  test(`${layer} respects the frontend/backend import boundary`, () => {
    for (const file of walk(path.join(root, layer))) {
      const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
      const check = specifier => {
        if (!specifier || !ts.isStringLiteral(specifier)) return;
        const value = specifier.text;
        const target = value.startsWith('.') ? path.resolve(path.dirname(file), value)
          : value.startsWith('@/') ? path.resolve(root, value.slice(2)) : null;
        if (!target) return;
        const targetLayer = path.relative(root, target).split(path.sep)[0];
        const allowed = layer === 'shared' ? ['shared'] : [layer, 'shared'];
        assert.ok(allowed.includes(targetLayer), `${path.relative(root, file)} imports ${value}; allowed layers: ${allowed.join(', ')}`);
      };
      const visit = node => {
        if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) check(node.moduleSpecifier);
        if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || node.expression.getText(source) === 'require')) check(node.arguments[0]);
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
  });
}
