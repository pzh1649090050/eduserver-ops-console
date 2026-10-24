# React Console Migration Design

## Goal

Move the EduServer Ops Console from a single static HTML file to a maintainable React + Vite + TypeScript application while preserving the five-view demo workflow and its non-destructive security boundary.

## Scope

The migration covers the browser application only. It includes five routed views: Overview, Container Services, Rollout, Backups, and Audit Log. It replaces inline markup and script with reusable layout, panel, table, status-tag, drawer, and filter components. It adds a local mock data module and mock actions for search, filtering, checks, backup creation, and rollout submission.

The migration does not add authentication, a server API, Docker access, persistence, or real operational commands. All actions remain local demonstrations and keep the existing Chinese safety copy.

## Architecture

Use React 18 with Vite and TypeScript. React Router maps `/`, `/services`, `/rollout`, `/backups`, and `/audit` to view components. Zustand stores the selected environment, service filters, and transient demo status. Mock data is plain TypeScript in `src/mocks/`; action functions return local results and never call a network endpoint.

Shared application chrome lives in `src/app/` and reusable visual primitives live in `src/components/`. Feature-specific UI lives under `src/features/<view>/`. The existing visual language is retained in `src/styles.css`, with responsive rules for desktop, tablet, and narrow screens.

## Compatibility and Safety

Each view renders a root element with both `data-view="<name>"` and `id="<name>-view"`. The IDs `open-rollout`, `drawer`, `env`, `service-search`, and `audit-search` remain stable. The strings `模拟提交` and `不会执行服务器变更` remain present. All real-looking IPs, hostnames, and container names become neutral examples such as `production.example.invalid`, `demo-pc-server`, and `demo-mysql`.

## Verification

`npm run build` must succeed. The Node structure test must inspect the React source contract, and browser smoke checks must cover all routes, service search, audit filtering, demo backup creation, rollout drawer behavior, and narrow-screen layout. README and AGENTS instructions must describe the new Vite commands and continue to state that no server commands execute.
