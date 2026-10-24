import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const routes = await readFile(new URL('../src/app/routes.tsx', import.meta.url), 'utf8');
const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
const rollout = await readFile(
  new URL('../src/features/rollout/RolloutView.tsx', import.meta.url),
  'utf8',
);
const appShell = await readFile(new URL('../src/app/AppShell.tsx', import.meta.url), 'utf8');
const drawer = await readFile(
  new URL('../src/components/UpgradeDrawer.tsx', import.meta.url),
  'utf8',
);
const views = await Promise.all(
  ['overview', 'services', 'rollout', 'backups', 'audit'].map((view) =>
    readFile(
      new URL(
        `../src/features/${view}/${view === 'overview' ? 'Overview' : view[0].toUpperCase() + view.slice(1)}View.tsx`,
        import.meta.url,
      ),
      'utf8',
    ),
  ),
);

test('console exposes every navigation view and its target panel', () => {
  for (const [index, view] of ['overview', 'services', 'rollout', 'backups', 'audit'].entries()) {
    assert.match(
      routes,
      view === 'overview' ? /index:\s*true/ : new RegExp(String.raw`path:\s*'${view}'`),
    );
    assert.match(appShell, new RegExp(String.raw`view:\s*'${view}'`));
    assert.match(views[index], new RegExp(String.raw`data-view="${view}"`));
    assert.match(views[index], new RegExp(String.raw`id="${view}-view"`));
  }
});

test('console keeps the key non-destructive interaction hooks', () => {
  for (const id of ['open-rollout', 'drawer', 'env', 'service-search', 'audit-search']) {
    assert.match(
      `${appShell}\n${rollout}\n${views.join('\n')}\n${drawer}`,
      new RegExp(String.raw`id="${id}"`),
    );
  }
  assert.match(drawer, /模拟提交/);
  assert.match(`${rollout}\n${drawer}`, /不会执行服务器变更/);
});

test('console documents its browser metadata and narrow-screen layout contract', () => {
  assert.match(index, /<link rel="icon" href="\/favicon\.svg"/);
  assert.match(index, /<meta\s+name="description"/);
  assert.match(index, /<meta\s+name="application-name"/);
  assert.match(styles, /@media\s*\(max-width:\s*620px\)/);
  assert.match(styles, /\.app-shell\s*\{[\s\S]*?display:\s*block;/);
  assert.match(styles, /-webkit-overflow-scrolling:\s*touch/);
});
