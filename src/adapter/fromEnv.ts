import { createProductionAdapter, type AdapterAuditRecord } from './productionAdapter';

type RuntimeConfig = Record<string, string | undefined>;

function parseList(value: string | undefined) {
  return value
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function createProductionAdapterFromEnv(
  env: RuntimeConfig = import.meta.env,
  auditSink?: (record: AdapterAuditRecord) => void | Promise<void>,
) {
  return createProductionAdapter({
    baseUrl: env.VITE_OPS_PROXY_URL,
    token: env.VITE_OPS_PROXY_TOKEN,
    actor: env.VITE_OPS_OPERATOR,
    allowedEnvironments: parseList(env.VITE_OPS_ALLOWED_ENVIRONMENTS),
    auditSink,
  });
}
