import { create } from 'zustand';
import { environments } from '../mocks/data';
import type { AuditKind } from '../mocks/types';

type ConsoleState = {
  environmentId: string;
  isDrawerOpen: boolean;
  statusMessage: string;
  serviceQuery: string;
  serviceStateFilter: 'all' | 'ok' | 'warning';
  auditQuery: string;
  auditKind: 'all' | AuditKind;
  setEnvironment: (environmentId: string) => void;
  setStatusMessage: (statusMessage: string) => void;
  setDrawerOpen: (isDrawerOpen: boolean) => void;
  setServiceQuery: (serviceQuery: string) => void;
  setServiceStateFilter: (serviceStateFilter: 'all' | 'ok' | 'warning') => void;
  setAuditQuery: (auditQuery: string) => void;
  setAuditKind: (auditKind: 'all' | AuditKind) => void;
};

export const useConsoleStore = create<ConsoleState>((set) => ({
  environmentId: environments[0].id,
  isDrawerOpen: false,
  statusMessage: '',
  serviceQuery: '',
  serviceStateFilter: 'all',
  auditQuery: '',
  auditKind: 'all',
  setEnvironment: (environmentId) => set({ environmentId }),
  setStatusMessage: (statusMessage) => set({ statusMessage }),
  setDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),
  setServiceQuery: (serviceQuery) => set({ serviceQuery }),
  setServiceStateFilter: (serviceStateFilter) => set({ serviceStateFilter }),
  setAuditQuery: (auditQuery) => set({ auditQuery }),
  setAuditKind: (auditKind) => set({ auditKind }),
}));
