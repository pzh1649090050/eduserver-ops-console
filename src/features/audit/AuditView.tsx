import { useMemo } from 'react';
import { auditRecords } from '../../mocks/data';
import { Panel } from '../../components/Panel';
import { useConsoleStore } from '../../state/useConsoleStore';

export function AuditView() {
  const query = useConsoleStore((state) => state.auditQuery);
  const kind = useConsoleStore((state) => state.auditKind);
  const setAuditQuery = useConsoleStore((state) => state.setAuditQuery);
  const setAuditKind = useConsoleStore((state) => state.setAuditKind);
  const filtered = useMemo(
    () =>
      auditRecords.filter(
        (record) =>
          (kind === 'all' || record.kind === kind) &&
          `${record.title} ${record.actor} ${record.environment}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [kind, query],
  );
  return (
    <section className="content" data-view="audit" id="audit-view">
      <div className="heading">
        <div>
          <h1>审计日志</h1>
          <p>记录操作员、目标环境和演示任务结果。</p>
        </div>
        <div className="view-toolbar">
          <input
            id="audit-search"
            type="search"
            value={query}
            onChange={(event) => setAuditQuery(event.target.value)}
            placeholder="搜索操作或目标"
            aria-label="搜索审计日志"
          />
          <select
            value={kind}
            onChange={(event) =>
              setAuditKind(event.target.value as 'all' | 'check' | 'backup' | 'rollout')
            }
            aria-label="筛选审计类型"
          >
            <option value="all">全部类型</option>
            <option value="check">检查</option>
            <option value="backup">备份</option>
            <option value="rollout">发布</option>
          </select>
        </div>
      </div>
      <Panel title="操作记录" meta={`${filtered.length} 条记录`}>
        <div className="audit-list">
          {filtered.map((record) => (
            <div className="audit-item" key={record.id}>
              <div
                className={`audit-mark ${record.kind === 'check' && record.icon === '!' ? 'warn' : ''}`}
              >
                {record.icon}
              </div>
              <div>
                <strong>{record.title}</strong>
                <time>
                  {record.time} · {record.actor} · {record.environment}
                </time>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="empty">没有匹配的演示日志。</div>}
        </div>
      </Panel>
    </section>
  );
}
