import { useMemo } from 'react';
import { DataTable } from '../../components/DataTable';
import { Panel } from '../../components/Panel';
import { StatusTag } from '../../components/StatusTag';
import { services } from '../../mocks/data';
import { demoAdapter } from '../../adapter/demoAdapter';
import { useConsoleStore } from '../../state/useConsoleStore';

export function ServicesView() {
  const { setStatusMessage } = useConsoleStore();
  const query = useConsoleStore((state) => state.serviceQuery);
  const stateFilter = useConsoleStore((state) => state.serviceStateFilter);
  const setServiceQuery = useConsoleStore((state) => state.setServiceQuery);
  const setServiceStateFilter = useConsoleStore((state) => state.setServiceStateFilter);
  const filtered = useMemo(
    () =>
      services.filter(
        (service) =>
          `${service.name} ${service.image} ${service.container}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (stateFilter === 'all' || service.state === stateFilter),
      ),
    [query, stateFilter],
  );
  return (
    <section className="content" data-view="services" id="services-view">
      <div className="heading">
        <div>
          <h1>容器服务</h1>
          <p>查看服务版本、运行状态和需要关注的项目。</p>
        </div>
        <div className="view-toolbar">
          <input
            id="service-search"
            type="search"
            value={query}
            onChange={(event) => setServiceQuery(event.target.value)}
            placeholder="搜索服务或镜像"
            aria-label="搜索服务或镜像"
          />
          <select
            value={stateFilter}
            onChange={(event) =>
              setServiceStateFilter(event.target.value as 'all' | 'ok' | 'warning')
            }
            aria-label="筛选服务状态"
          >
            <option value="all">全部状态</option>
            <option value="ok">运行正常</option>
            <option value="warning">需关注</option>
          </select>
        </div>
      </div>
      <Panel title="服务清单" meta={`${filtered.length} 项服务`}>
        <DataTable headers={['服务', '镜像', '状态', '端口', '最近检查', '操作']}>
          {filtered.map((service) => (
            <tr key={service.id}>
              <td>
                <strong>{service.name}</strong>
                <small>{service.container}</small>
              </td>
              <td>{service.image}</td>
              <td>
                <StatusTag state={service.state} label={service.stateLabel} />
              </td>
              <td>{service.port}</td>
              <td>{service.checkedAt}</td>
              <td>
                <button
                  className="action-link"
                  type="button"
                  onClick={async () =>
                    setStatusMessage(await demoAdapter.checkVersion(service.name))
                  }
                >
                  检查版本
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
        {filtered.length === 0 && <div className="empty">没有匹配的演示服务。</div>}
      </Panel>
    </section>
  );
}
