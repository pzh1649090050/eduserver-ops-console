import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './AppShell';
import { AuditView } from '../features/audit/AuditView';
import { BackupsView } from '../features/backups/BackupsView';
import { OverviewView } from '../features/overview/OverviewView';
import { RolloutView } from '../features/rollout/RolloutView';
import { ServicesView } from '../features/services/ServicesView';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <OverviewView /> },
      { path: 'services', element: <ServicesView /> },
      { path: 'rollout', element: <RolloutView /> },
      { path: 'backups', element: <BackupsView /> },
      { path: 'audit', element: <AuditView /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
