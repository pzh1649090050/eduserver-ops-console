import type { Activity, AuditRecord, BackupRecord, Environment, Service } from './types';

export const environments: Environment[] = [
  { id: 'production', label: '演示生产环境 · production.example.invalid' },
  { id: 'staging', label: '演示测试环境 · staging.example.invalid' },
];

export const services: Service[] = [
  {
    id: 'pc-server',
    name: 'EduServer · 应用服务',
    container: 'demo-pc-server',
    image: 'eduserver:demo-1.8',
    state: 'ok',
    stateLabel: '运行中',
    port: '10017 → 80',
    checkedAt: '今天 09:18',
  },
  {
    id: 'mysql',
    name: 'EduServer · 数据库',
    container: 'demo-mysql',
    image: 'mysql:demo-5.7',
    state: 'warning',
    stateLabel: '需升级',
    port: '33060 → 3306',
    checkedAt: '今天 09:16',
  },
  {
    id: 'nginx',
    name: 'Nginx Gateway',
    container: 'demo-nginx',
    image: 'nginx:demo-alpine',
    state: 'ok',
    stateLabel: '运行中',
    port: '10009 → 80',
    checkedAt: '今天 09:17',
  },
  {
    id: 'admin-web',
    name: '管理后台 Web',
    container: 'demo-admin-web',
    image: 'admin-web:demo-1.0',
    state: 'warning',
    stateLabel: '有新版本',
    port: '3000 → 3000',
    checkedAt: '今天 09:15',
  },
];

export const activities: Activity[] = [
  {
    id: 'backup-complete',
    tone: 'good',
    icon: '✓',
    title: '数据库备份完成',
    time: '今天 02:00 · 1.8 GB',
  },
  {
    id: 'image-available',
    tone: 'info',
    icon: '↻',
    title: '检测到 eduserver:demo-1.9 可用',
    time: '今天 09:14 · 需要人工审批',
  },
  {
    id: 'mysql-warning',
    tone: 'warn',
    icon: '!',
    title: '演示数据库版本进入维护结束阶段',
    time: '昨天 18:42 · 高风险提醒',
  },
  {
    id: 'agent-health',
    tone: 'good',
    icon: '✓',
    title: '演示代理连接健康检查通过',
    time: '昨天 18:30 · 延迟 42 ms',
  },
];

export const backups: BackupRecord[] = [
  {
    id: 'backup-1',
    time: '今天 02:00',
    target: '演示数据库',
    size: '1.8 GB',
    retention: '2026-11-23',
    verified: true,
  },
  {
    id: 'backup-2',
    time: '昨天 02:00',
    target: '演示数据库',
    size: '1.8 GB',
    retention: '2026-11-22',
    verified: true,
  },
];

export const auditRecords: AuditRecord[] = [
  {
    id: 'audit-1',
    kind: 'backup',
    icon: '✓',
    title: '数据库备份完成',
    time: '今天 02:00',
    actor: 'system',
    environment: '演示生产环境',
  },
  {
    id: 'audit-2',
    kind: 'check',
    icon: '↻',
    title: '检查到 eduserver:demo-1.9 可用',
    time: '今天 09:14',
    actor: '演示操作员',
    environment: '演示生产环境',
  },
  {
    id: 'audit-3',
    kind: 'check',
    icon: '!',
    title: '数据库维护结束提醒',
    time: '昨天 18:42',
    actor: 'system',
    environment: '演示生产环境',
  },
  {
    id: 'audit-4',
    kind: 'rollout',
    icon: '↗',
    title: '升级流程已创建',
    time: '昨天 17:20',
    actor: '演示操作员',
    environment: '演示测试环境',
  },
];
