# Repository Guidelines

## AI 开发规范（防返工 · 必须遵守）

改动前先对照三条铁律，缺一不可：

1. **先对齐，再动手** —— 需求没确认、验收标准没写清之前，不写代码。
2. **一次只做一件事** —— 每次提交只完成一个明确目标，不做无关的“顺手改”。
3. **改完必验证** —— 结构测试 + 手动验证都通过才算完成。

动手前：

- 先**复述**需求：目标、范围、什么算“完成”；有歧义先问，禁止自行脑补。
- 先读相关文件：`index.html`（页面）、`tests/console-structure.test.mjs`（结构契约）、`README.md`（范围与安全边界）。不读就改是返工主因。

变更管理（避免改了又改）：

- 需求变更走三步：记录变更 → 评估影响 → 确认后实施。
- 评估影响面：波及哪些视图、`data-view`/`id` 契约、哪些测试断言。
- 禁止擅自扩大改动范围；发现相关问题单独提出，不混进当前改动。

结构契约（由 `tests/console-structure.test.mjs` 锁定，不可破坏）：

- 五个视图同时存在 `data-view="X"` 与 `id="X-view"`：`overview` / `services` / `rollout` / `backups` / `audit`。
- 关键 id 保留：`open-rollout`、`drawer`、`env`、`service-search`、`audit-search`。
- 保留文案：模拟提交、不会执行服务器变更。

测试与验证（防回归）：

- 每次改动后运行：`node --test tests/console-structure.test.mjs`
- 改页面结构/交互时，同步更新或补充结构测试，而不是只改页面。
- 修 bug 时补一条能复现该 bug 的回归断言。
- 手动验证：桌面 + 窄屏，检查交互可用、无溢出、演示操作非破坏。

完成定义（提交前自检）：

- 结构测试全部通过；手动验证通过；未混入无关改动或日志改动；命名缩进符合规范；提交信息简洁。

提交与交付：

- 提交信息用简洁祈使句（如 `Add service status filter`）。
- 说明可见行为变化与手动验证步骤；布局改动附截图；不混入无关格式/日志改动。

安全边界（不可破坏）：

- 原型不含凭据、不执行服务器命令，演示操作非破坏。
- 未来变更操作走认证 + 白名单 HTTPS 代理，带审计，不直连 Docker Socket。

AI Agent 行为准则：

- 先读后写：改文件前先读它，不凭假设动手。
- 一次一个目标：一个提交只解决一件事。
- 改前说方案，改后报验证。
- 遇到歧义先问，不猜。
- 尊重现有结构：不删除/覆盖不理解含义的 `data-view`、`id` 约定与测试断言。

兜底规则：

- 同一处改动连续 2 次仍不通过时，停下来复盘根因，而不是继续打补丁；定位根因后补回归测试。

## Project Structure & Module Organization

This repository is a small, browser-based EduServer operations console prototype.

- `index.html` contains the complete page: markup, inline CSS, and inline JavaScript.
- `README.md` documents the prototype scope, local server command, and intended production adapter.
- `server.out.log` and `server.err.log` are local server output files; do not treat them as source.
- `tests/` contains dependency-free Node.js structure checks. Keep additions focused and introduce directories only when a feature needs them.

## Build, Test, and Development Commands

Use npm and Vite during development:

```bash
npm install --legacy-peer-deps
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173/`; port 8090 is an unrelated local Apache service. For a quick smoke check, load all five routes and exercise the upgrade drawer, service filters, navigation, backup action, audit filter, and environment selector. The UI uses sample data and must not be described as connected to Docker or a production server.

Run the structural regression checks with `npm test` and compile the production bundle with `npm run build`.

## Coding Style & Naming Conventions

Keep the existing two-space indentation and compact HTML/CSS style unless a larger refactor makes a different layout substantially clearer. Use semantic HTML where practical, kebab-case for CSS classes and IDs (`.panel-head`, `open-rollout`), and descriptive `data-*` attributes for UI state (`data-filter`, `data-state`). Keep prototype behavior in the existing inline `<script>` until a dedicated JavaScript module is justified. Avoid adding dependencies for static UI changes.

## Testing Guidelines

Structural tests run on Node.js; there are no coverage thresholds. Manually verify changes in a current browser at desktop and narrow/mobile widths. Check that interactive controls remain usable, responsive layouts do not overflow, and demo actions clearly remain non-destructive.

## Commit & Pull Request Guidelines

This checkout has no Git history, so no repository-specific commit convention can be inferred. Use concise imperative messages such as `Document local prototype workflow` or `Add service status filter`. Pull requests should explain the visible behavior change, list manual verification steps, and include screenshots for layout changes. Keep unrelated formatting or generated log changes out of the change.

## Security & Configuration Notes

The prototype intentionally contains no credentials and does not execute server commands. Preserve the documented design: future mutating operations should go through an authenticated, allowlisted HTTPS operations agent, with audit records and no direct browser access to Docker Socket.
