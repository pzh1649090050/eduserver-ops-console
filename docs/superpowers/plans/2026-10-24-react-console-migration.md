# React Console Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the single-file EduServer Ops Console prototype with a routed React + Vite + TypeScript application that preserves the five-view demo contract.

**Architecture:** React Router owns five view routes, Zustand stores UI/demo state, and typed mock data/actions supply all values without network access. Shared layout and primitives are separated from feature views; CSS is moved to one responsive stylesheet.

**Tech Stack:** React 18, Vite, TypeScript, React Router, Zustand, Node built-in test runner.

**Spec:** `docs/superpowers/specs/2026-10-24-react-console-design.md`

## Global Constraints

- Keep all actions local demonstrations; never call Docker, a server API, or a network endpoint.
- Preserve `data-view`/`id` pairs for `overview`, `services`, `rollout`, `backups`, and `audit`.
- Preserve `open-rollout`, `drawer`, `env`, `service-search`, `audit-search`, `模拟提交`, and `不会执行服务器变更`.
- Replace real-looking infrastructure identifiers with neutral example values.
- Use two-space indentation and kebab-case DOM IDs/classes.

### Task 1: Scaffold the Vite application

**Files:** Create `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/vite-env.d.ts`; modify `README.md` and `tests/console-structure.test.mjs`.

- [ ] Write the source-contract test first: read `src/app/routes.tsx` and assert all five route paths and view IDs are present; assert safety strings in `src/features/rollout/RolloutView.tsx`.
- [ ] Run `node --test tests/console-structure.test.mjs` and observe the expected missing-file failure.
- [ ] Create the Vite package manifest and scripts: `dev`, `build`, `preview`, and `test`.
- [ ] Add the minimal React entry point and TypeScript configuration.
- [ ] Run `npm install` and `npm run build` to verify the empty app scaffold.

### Task 2: Add typed mock data and Zustand state

**Files:** Create `src/mocks/types.ts`, `src/mocks/data.ts`, `src/mocks/actions.ts`, `src/state/useConsoleStore.ts`.

- [ ] Define typed `Environment`, `Service`, `Activity`, `BackupRecord`, and `AuditRecord` models using neutral example identifiers.
- [ ] Export deterministic demo records matching the current four services, two backups, and four audit entries.
- [ ] Implement local actions for version checks, backup creation, and audit filtering; return promises only to model UI latency and never use `fetch`.
- [ ] Add Zustand state for environment, service query/status, audit query/type, and status message.
- [ ] Run `npm run build`.

### Task 3: Build shared layout and visual primitives

**Files:** Create `src/app/AppShell.tsx`, `src/app/routes.tsx`, `src/components/Panel.tsx`, `src/components/StatusTag.tsx`, `src/components/DataTable.tsx`, `src/components/UpgradeDrawer.tsx`, `src/styles.css`.

- [ ] Move sidebar, top bar, environment selector, status announcer, and route outlet into `AppShell`.
- [ ] Implement reusable panel, status tag, data table, and upgrade drawer components with stable IDs and keyboard-close behavior.
- [ ] Copy the existing visual tokens and responsive breakpoints into `src/styles.css`.
- [ ] Wire React Router routes and make the default route redirect to `/`.
- [ ] Run `npm run build`.

### Task 4: Implement the five feature views

**Files:** Create `src/features/overview/OverviewView.tsx`, `src/features/services/ServicesView.tsx`, `src/features/rollout/RolloutView.tsx`, `src/features/backups/BackupsView.tsx`, `src/features/audit/AuditView.tsx`.

- [ ] Implement each view with the shared components and mock store.
- [ ] Preserve search/filter controls with IDs `service-search` and `audit-search`.
- [ ] Keep rollout copy and drawer ID; ensure submit displays local demo feedback only.
- [ ] Ensure all view roots include the required `data-view` and `id` attributes.
- [ ] Run `node --test tests/console-structure.test.mjs` and `npm run build`.

### Task 5: Update docs and verify the browser workflow

**Files:** Modify `README.md`, `AGENTS.md`, `tests/console-structure.test.mjs`.

- [ ] Document `npm install`, `npm run dev`, `npm run build`, `npm test`, and the default Vite URL.
- [ ] Run the structure test and build from a clean shell.
- [ ] Start Vite and manually verify all five routes, service search, audit filter, backup demo, rollout drawer, and narrow-screen layout.
- [ ] Check that no real IP, host, or container identifiers remain in `src/` or the user-facing docs.
