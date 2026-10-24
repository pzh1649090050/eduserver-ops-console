import { describe, expect, test, vi } from 'vitest';
import { createProductionAdapter } from '../src/adapter/productionAdapter';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('production read-only adapter', () => {
  test('returns demo mode without configuration and never touches the network', async () => {
    const fetcher = vi.fn<typeof fetch>();
    const adapter = createProductionAdapter({ fetcher });

    await expect(adapter.getStatus('demo-environment')).resolves.toMatchObject({
      mode: 'demo',
      configured: false,
      environmentId: 'demo-environment',
      message: '生产适配器未配置，当前为演示模式。',
    });
    expect(fetcher).not.toHaveBeenCalled();
  });

  test('rejects a configured adapter without authentication before any request', async () => {
    const fetcher = vi.fn<typeof fetch>();
    const adapter = createProductionAdapter({
      baseUrl: 'https://ops.example.invalid',
      allowedEnvironments: ['demo-environment'],
      auditSink: vi.fn(),
      fetcher,
    });

    await expect(adapter.getStatus('demo-environment')).rejects.toThrow(
      'Production adapter requires authentication',
    );
    expect(fetcher).not.toHaveBeenCalled();
  });

  test('rejects an environment outside the allowlist before any request', async () => {
    const fetcher = vi.fn<typeof fetch>();
    const auditSink = vi.fn();
    const adapter = createProductionAdapter({
      baseUrl: 'https://ops.example.invalid',
      token: 'injected-token',
      allowedEnvironments: ['allowed-environment'],
      actor: 'injected-operator',
      fetcher,
      auditSink,
    });

    await expect(adapter.getStatus('unknown-environment')).rejects.toThrow(
      'Environment is not allowlisted',
    );
    expect(fetcher).not.toHaveBeenCalled();
    expect(auditSink).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: 'status-read',
        targetEnvironment: 'unknown-environment',
        commandResult: 'rejected',
      }),
    );
  });

  test('reads status through the authenticated HTTPS endpoint and records the read', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        jsonResponse({ services: [], health: 'ok', fetchedAt: '2026-10-24T00:00:00Z' }),
      );
    const auditSink = vi.fn();
    const adapter = createProductionAdapter({
      baseUrl: 'https://ops.example.invalid/',
      token: 'injected-token',
      actor: 'injected-operator',
      allowedEnvironments: ['demo-environment'],
      fetcher,
      auditSink,
    });

    await expect(adapter.getStatus('demo-environment')).resolves.toMatchObject({
      mode: 'production',
      configured: true,
      services: [],
      health: 'ok',
    });
    expect(fetcher).toHaveBeenCalledWith(
      'https://ops.example.invalid/v1/environments/demo-environment/status',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Accept: 'application/json',
          Authorization: 'Bearer injected-token',
        }),
      }),
    );
    expect(auditSink).toHaveBeenCalledWith(
      expect.objectContaining({
        operator: 'injected-operator',
        operation: 'status-read',
        targetEnvironment: 'demo-environment',
        commandResult: 'read',
      }),
    );
  });

  test('rejects non-HTTPS proxy URLs', () => {
    expect(() =>
      createProductionAdapter({
        baseUrl: 'http://ops.example.invalid',
        token: 'injected-token',
        allowedEnvironments: ['demo-environment'],
      }),
    ).toThrow('Production adapter requires an HTTPS base URL');
  });
});
