import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { AuditView } from '../src/features/audit/AuditView';
import { BackupsView } from '../src/features/backups/BackupsView';
import { ServicesView } from '../src/features/services/ServicesView';
import { UpgradeDrawer } from '../src/components/UpgradeDrawer';
import { useConsoleStore } from '../src/state/useConsoleStore';

vi.mock('../src/adapter/demoAdapter', () => ({
  demoAdapter: {
    createBackup: vi.fn(async () => ({
      id: 'backup-new',
      time: '刚刚',
      target: '演示数据库',
      size: '1.8 GB',
      retention: '30 天后',
      verified: true,
    })),
    checkVersion: vi.fn(async (label: string) => `${label} 检查完成`),
    submitRollout: vi.fn(async () => '演示发布已提交；不会执行服务器变更。'),
  },
}));

beforeEach(() => {
  useConsoleStore.setState({
    environmentId: 'production',
    isDrawerOpen: false,
    statusMessage: '',
    serviceQuery: '',
    serviceStateFilter: 'all',
    auditQuery: '',
    auditKind: 'all',
  });
});

describe('services and audit filters', () => {
  test('searches services by container or image and narrows the table', async () => {
    const user = userEvent.setup();
    render(<ServicesView />);

    expect(screen.getAllByRole('row')).toHaveLength(5);
    await user.type(screen.getByRole('searchbox', { name: '搜索服务或镜像' }), 'demo-mysql');

    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.getByText('EduServer · 数据库')).toBeInTheDocument();
    expect(screen.queryByText('Nginx Gateway')).not.toBeInTheDocument();
  });

  test('filters services by warning state', async () => {
    const user = userEvent.setup();
    render(<ServicesView />);

    await user.selectOptions(screen.getByRole('combobox', { name: '筛选服务状态' }), 'warning');

    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getByText('EduServer · 数据库')).toBeInTheDocument();
    expect(screen.getByText('管理后台 Web')).toBeInTheDocument();
    expect(screen.queryByText('Nginx Gateway')).not.toBeInTheDocument();
  });

  test('filters audit records by kind and search text', async () => {
    const user = userEvent.setup();
    render(<AuditView />);

    await user.selectOptions(screen.getByRole('combobox', { name: '筛选审计类型' }), 'rollout');
    expect(screen.getByText('升级流程已创建')).toBeInTheDocument();
    expect(screen.queryByText('数据库备份完成')).not.toBeInTheDocument();

    await user.type(screen.getByRole('searchbox', { name: '搜索审计日志' }), '不存在');
    expect(screen.getByText('没有匹配的演示日志。')).toBeInTheDocument();
  });
});

describe('upgrade drawer', () => {
  test('blocks submission until every checklist item is checked', async () => {
    const user = userEvent.setup();
    useConsoleStore.setState({ isDrawerOpen: true });
    render(<UpgradeDrawer />);

    const dialog = screen.getByRole('dialog', { name: '准备升级 EduServer' });
    await user.click(within(dialog).getByRole('button', { name: '模拟提交' }));
    expect(screen.getByRole('status')).toHaveTextContent('请完成全部检查项后再运行演示。');

    const checks = within(dialog).getAllByRole('checkbox');
    for (const checkbox of checks.slice(1)) await user.click(checkbox);
    await user.click(within(dialog).getByRole('button', { name: '模拟提交' }));

    expect(screen.getByRole('status')).toHaveTextContent('演示发布已提交；不会执行服务器变更。');
    expect(useConsoleStore.getState().statusMessage).toContain('不会执行服务器变更');
  });

  test('closes from Escape and preserves the non-destructive notice', async () => {
    const user = userEvent.setup();
    useConsoleStore.setState({ isDrawerOpen: true });
    render(<UpgradeDrawer />);

    expect(screen.getByText('当前页面没有连接运维代理，不会执行服务器变更。')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('backup flow', () => {
  test('adds a backup row and reports a safe demo status', async () => {
    const user = userEvent.setup();
    render(<BackupsView />);

    expect(screen.getAllByRole('row')).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: '模拟创建备份' }));

    expect(screen.getAllByRole('row')).toHaveLength(4);
    expect(screen.getByText('刚刚')).toBeInTheDocument();
    expect(useConsoleStore.getState().statusMessage).toBe(
      '已创建一条演示备份记录；未执行数据库备份。',
    );
  });

  test('reports safe verification status for an existing backup', async () => {
    const user = userEvent.setup();
    render(<BackupsView />);

    await user.click(screen.getAllByRole('button', { name: '重新校验' })[0]);
    expect(useConsoleStore.getState().statusMessage).toBe(
      '演示数据库 的演示校验已完成；未读取真实备份。',
    );
  });
});
