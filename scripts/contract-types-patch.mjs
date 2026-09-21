import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const jsonPath = resolve(root, 'src/prisma/contract.json');
const dtsPath = resolve(root, 'src/prisma/contract.d.ts');

const contract = JSON.parse(readFileSync(jsonPath, 'utf8'));

const toOne = new Map();
for (const ns of Object.values(contract.domain?.namespaces ?? {})) {
  for (const [model, m] of Object.entries(ns.models ?? {})) {
    for (const [rel, r] of Object.entries(m.relations ?? {})) {
      if (r.cardinality === 'N:1' || r.cardinality === '1:1') {
        toOne.set(`${model}.${rel}`, r.nullable ?? false);
      }
    }
  }
}

if (toOne.size === 0) {
  console.log('[contract-types-patch] no to-one relations to patch');
  process.exit(0);
}

const lines = readFileSync(dtsPath, 'utf8').split('\n');
const indentOf = (line) => (line.match(/^\s*/) || [''])[0].length;

const domainStart = lines.findIndex((line) => /^\s*readonly domain: \{$/.test(line));
if (domainStart === -1) {
  console.error('[contract-types-patch] could not locate the domain block in contract.d.ts');
  process.exit(1);
}

let depth = 0;
let domainEnd = domainStart;
for (let i = domainStart; i < lines.length; i++) {
  const line = lines[i];
  depth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
  if (depth <= 0) {
    domainEnd = i;
    break;
  }
}

const domain = lines.slice(domainStart, domainEnd + 1);
const originalDomainLength = domain.length;
const stack = [];
let patched = 0;

const currentModel = () => {
  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i].kind === 'model') return stack[i].name;
  }
  return undefined;
};

const relationBlockHasNullable = (block, relationIndent) => {
  for (let j = 0; j < block.length; j++) {
    if (indentOf(block[j]) <= relationIndent) break;
    if (/^\s*readonly nullable:/.test(block[j])) return true;
  }
  return false;
};

for (let i = 0; i < domain.length; i++) {
  const line = domain[i];
  const indent = indentOf(line);

  while (stack.length && stack[stack.length - 1].indent > indent) {
    if (stack[stack.length - 1].indent > indent) stack.pop();
    else break;
  }
  if (/^\s*\};\s*$/.test(line) || /^\s*\},\s*$/.test(line)) {
    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
    continue;
  }

  if (/^\s*readonly models: \{$/.test(line)) {
    stack.push({ kind: 'models', indent });
    continue;
  }
  if (/^\s*readonly relations: \{$/.test(line)) {
    stack.push({ kind: 'relations', indent });
    continue;
  }

  const obj = line.match(/^(\s*)readonly ([A-Za-z_][A-Za-z0-9_]*): \{$/);
  if (obj) {
    const indentMatch = obj[1].length;
    const name = obj[2];
    const top = stack[stack.length - 1];
    if (top && top.kind === 'models' && top.indent < indentMatch) {
      stack.push({ kind: 'model', indent, name });
    } else if (top && top.kind === 'relations' && top.indent < indentMatch) {
      const model = currentModel();
      const key = `${model}.${name}`;
      stack.push(toOne.has(key) ? { kind: 'relation', indent, name, key } : { kind: 'other', indent });
    } else {
      stack.push({ kind: 'other', indent });
    }
    continue;
  }

  const card = line.match(/readonly cardinality: '([^']+)';/);
  if (card && stack.length && stack[stack.length - 1].kind === 'relation') {
    const relation = stack[stack.length - 1];
    const value = card[1] === 'N:1' || card[1] === '1:1' ? toOne.get(relation.key) : undefined;
    if (value !== undefined) {
      const rest = domain.slice(i + 1);
      if (!relationBlockHasNullable(rest, relation.indent)) {
        domain.splice(i + 1, 0, `${' '.repeat(indent)}readonly nullable: ${value};`);
        patched++;
        i++;
      }
    }
  }
}

if (patched === 0) {
  console.log('[contract-types-patch] contract.d.ts already up to date');
} else {
  lines.splice(domainStart, originalDomainLength, ...domain);
  writeFileSync(dtsPath, lines.join('\n'));
  console.log(`[contract-types-patch] added missing nullable flag to ${patched} to-one relation(s)`);
}