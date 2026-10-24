# EduServer Ops Console

This directory contains a browser-based operations console prototype for the EduServer container upgrade workflow.

## Run locally

From the repository root:

```bash
npm install --legacy-peer-deps
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173/`. Do not use `http://localhost:8090`: that port is occupied by a separate Apache service on this computer. The page uses sample data and does not connect to Docker or execute server commands.

## Console views and checks

The static console includes Overview, Container Services, Rollout, Backups, and Audit Log views. Search, filters, backup creation, version checks, and rollout submission are local demonstrations only; they do not call an API or modify server data.

Run structural checks and a production build with:

```bash
npm test
npm run build
```

## Production adapter boundary (read-only phase)

`src/adapter/productionAdapter.ts` contains the first production boundary. This phase is read-only:
it calls `GET /v1/environments/:environmentId/status` through an HTTPS operations proxy and does not
expose backup, rollout, rollback, Docker, or shell commands to the browser.

The adapter is fail-closed. With no deployment configuration it returns an explicit demo-mode status and
does not make a network request. If a proxy URL is present, all of the following must be injected at
deployment time before a request is allowed:

- `VITE_OPS_PROXY_URL` — TBD; HTTPS proxy URL only.
- `VITE_OPS_PROXY_TOKEN` — TBD; short-lived authentication token, never committed.
- `VITE_OPS_OPERATOR` — TBD; authenticated operator identifier.
- `VITE_OPS_ALLOWED_ENVIRONMENTS` — TBD; comma-separated environment allowlist.

The configured adapter also requires an audit sink. Every status read, rejection, and HTTP failure records
the operator, target environment, result, reason, and timestamp. Until the proxy, authentication method,
allowlist, and audit sink are deployed, the UI remains on the local `demoAdapter` and cannot contact a server.
