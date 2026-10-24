import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { environments } from '../mocks/data';
import type { ViewName } from '../mocks/types';
import { UpgradeDrawer } from '../components/UpgradeDrawer';
import { useConsoleStore } from '../state/useConsoleStore';

const navItems: Array<{ view: ViewName; label: string; icon: string; path: string }> = [
  { view: 'overview', label: '总览', icon: '▦', path: '/' },
  { view: 'services', label: '容器服务', icon: '◫', path: '/services' },
  { view: 'rollout', label: '升级发布', icon: '↗', path: '/rollout' },
  { view: 'backups', label: '备份记录', icon: '◷', path: '/backups' },
  { view: 'audit', label: '审计日志', icon: '≡', path: '/audit' },
];

export function AppShell() {
  const location = useLocation();
  const activeView = (location.pathname.slice(1) || 'overview') as ViewName;
  const { environmentId, setEnvironment, statusMessage, setStatusMessage } = useConsoleStore();
  const currentLabel = navItems.find((item) => item.view === activeView)?.label ?? '环境总览';
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">E</div>
          <span>EduServer Ops</span>
        </div>
        <div className="nav-label">运维中心</div>
        <nav className="nav" aria-label="主导航">
          {navItems.map((item) => (
            <NavLink
              key={item.view}
              to={item.path}
              data-view={item.view}
              className={({ isActive }) => (isActive ? 'active' : '')}
              end={item.view === 'overview'}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          界面模式
          <div className="connection">
            <i className="dot" />
            演示数据
          </div>
        </div>
      </aside>
      <main>
        <header className="topbar">
          <div className="crumb">
            运维中心　/　<strong>{currentLabel}</strong>
          </div>
          <div className="top-actions">
            <select
              className="select"
              id="env"
              value={environmentId}
              onChange={(event) => {
                setEnvironment(event.target.value);
                setStatusMessage(
                  `已切换到${event.target.options[event.target.selectedIndex].text}；数据仍为演示数据。`,
                );
              }}
              aria-label="选择环境"
            >
              {environments.map((environment) => (
                <option key={environment.id} value={environment.id}>
                  {environment.label}
                </option>
              ))}
            </select>
            <div className="avatar" aria-label="当前操作员">
              D
            </div>
          </div>
        </header>
        <Outlet />
        <p className="sr-only" role="status" aria-live="polite">
          {statusMessage}
        </p>
      </main>
      <UpgradeDrawer />
    </div>
  );
}
