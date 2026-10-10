// Checks the generator hub cards in lib/hub-data/generators: every card has
// one slug equal to its file name, slugs are unique, and every card is
// imported in lib/hub-data/index.ts.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const dataDir = path.join(import.meta.dirname, '..', 'lib', 'hub-data');
const cardsDir = path.join(dataDir, 'generators');
const index = readFileSync(path.join(dataDir, 'index.ts'), 'utf8');
const imported = new Set(
  [...index.matchAll(/from\s+['"]\.\/generators\/([^'"]+)['"]/g)].map(
    (match) => match[1]
  )
);

const errors = [];
const owners = new Map();
const files = readdirSync(cardsDir)
  .filter((file) => file.endsWith('.ts'))
  .toSorted();

for (const file of files) {
  const name = file.slice(0, -'.ts'.length);
  const source = readFileSync(path.join(cardsDir, file), 'utf8');
  const slugs = [...source.matchAll(/\bslug:\s*['"]([^'"]+)['"]/g)].map(
    (match) => match[1]
  );

  if (slugs.length === 1) {
    const [slug] = slugs;
    if (slug !== name)
      errors.push(`${file}: slug '${slug}' differs from file name`);
    if (owners.has(slug)) {
      errors.push(`${file}: slug '${slug}' duplicates ${owners.get(slug)}`);
    } else {
      owners.set(slug, file);
    }
  } else {
    errors.push(`${file}: expected one slug, found ${slugs.length}`);
  }

  if (!imported.has(name))
    errors.push(`${file}: not imported in lib/hub-data/index.ts`);
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`${files.length} hub cards OK`);
}
