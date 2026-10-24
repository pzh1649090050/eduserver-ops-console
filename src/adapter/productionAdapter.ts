export type AdapterAuditRecord = {
  id: string;
  operator: string | undefined;
  operation: 'status-read';
  targetEnvironment: string;
  commandResult: 'read' | 'rejected' | 'failed' | 'skipped';
  timestamp: string;
  reason?: string;
};

export type ProductionStatus = {
  mode: 'production' | 'demo';
  configured: boolean;
  environmentId: string;
  services: unknown[];
  health: string;
  fetchedAt: string | null;
  message?: string;
  [key: string]: unknown;
};

export type ProductionAdapterConfig = {
  baseUrl?: string;
  token?: string;
  actor?: string;
  allowedEnvironments?: readonly string[];
  fetcher?: typeof fetch;
  auditSink?: (record: AdapterAuditRecord) => void | Promise<void>;
};

const DEMO_MODE_MESSAGE = '生产适配器未配置，当前为演示模式。';

function createAuditId() {
  return `audit-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`;
}

export function createProductionAdapter(config: ProductionAdapterConfig = {}) {
  const baseUrl = config.baseUrl?.trim().replace(/\/+$/, '');
  if (baseUrl) {
    const parsedUrl = new URL(baseUrl);
    if (parsedUrl.protocol !== 'https:') {
      throw new Error('Production adapter requires an HTTPS base URL');
    }
  }

  if (baseUrl && !config.auditSink) {
    throw new Error('Production adapter requires an audit sink');
  }

  const fetcher = config.fetcher ?? globalThis.fetch;
  if (!fetcher) throw new Error('Production adapter requires a fetch implementation');

  const recordAudit = async (
    targetEnvironment: string,
    commandResult: AdapterAuditRecord['commandResult'],
    reason?: string,
  ) => {
    await config.auditSink?.({
      id: createAuditId(),
      operator: config.actor,
      operation: 'status-read',
      targetEnvironment,
      commandResult,
      timestamp: new Date().toISOString(),
      ...(reason ? { reason } : {}),
    });
  };

  return {
    async getStatus(environmentId: string): Promise<ProductionStatus> {
      if (!baseUrl) {
        await recordAudit(environmentId, 'skipped', 'not-configured');
        return {
          mode: 'demo',
          configured: false,
          environmentId,
          services: [],
          health: 'unknown',
          fetchedAt: null,
          message: DEMO_MODE_MESSAGE,
        };
      }

      if (!config.token?.trim()) {
        await recordAudit(environmentId, 'rejected', 'missing-authentication');
        throw new Error('Production adapter requires authentication');
      }

      if (!config.allowedEnvironments?.includes(environmentId)) {
        await recordAudit(environmentId, 'rejected', 'environment-not-allowlisted');
        throw new Error('Environment is not allowlisted');
      }

      const response = await fetcher(
        `${baseUrl}/v1/environments/${encodeURIComponent(environmentId)}/status`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${config.token}`,
          },
          credentials: 'omit',
        },
      );

      if (!response.ok) {
        await recordAudit(environmentId, 'failed', `http-${response.status}`);
        throw new Error(`Status request failed with HTTP ${response.status}`);
      }

      const payload = (await response.json()) as Record<string, unknown>;
      await recordAudit(environmentId, 'read');
      return {
        ...payload,
        mode: 'production',
        configured: true,
        environmentId,
        services: Array.isArray(payload.services) ? payload.services : [],
        health: typeof payload.health === 'string' ? payload.health : 'unknown',
        fetchedAt: typeof payload.fetchedAt === 'string' ? payload.fetchedAt : null,
      };
    },
  };
}
