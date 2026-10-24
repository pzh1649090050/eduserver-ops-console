export type ViewName = 'overview' | 'services' | 'rollout' | 'backups' | 'audit';
export type ServiceState = 'ok' | 'warning';
export type AuditKind = 'check' | 'backup' | 'rollout';

export type Environment = {
  id: string;
  label: string;
};

export type Service = {
  id: string;
  name: string;
  container: string;
  image: string;
  state: ServiceState;
  stateLabel: string;
  port: string;
  checkedAt: string;
};

export type Activity = {
  id: string;
  tone: 'good' | 'info' | 'warn';
  icon: string;
  title: string;
  time: string;
};

export type BackupRecord = {
  id: string;
  time: string;
  target: string;
  size: string;
  retention: string;
  verified: boolean;
};

export type AuditRecord = {
  id: string;
  kind: AuditKind;
  icon: string;
  title: string;
  time: string;
  actor: string;
  environment: string;
};
