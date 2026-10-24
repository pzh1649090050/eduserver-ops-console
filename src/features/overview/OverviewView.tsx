import { activities, services } from '../../mocks/data';
import { Panel } from '../../components/Panel';
import { StatusTag } from '../../components/StatusTag';
import { useConsoleStore } from '../../state/useConsoleStore';
import { demoAdapter } from '../../adapter/demoAdapter';

export function OverviewView() {
  const { setDrawerOpen, setStatusMessage } = useConsoleStore();
  const checkService = async (name: string) =>
    setStatusMessage(await demoAdapter.checkVersion(name));
  return (
    <section className="content" data-view="overview" id="overview-view">
      <div className="heading">
        <div>
          <h1>环境总览</h1>
          <p>在受控流程中检查版本、备份数据并发布容器升级。</p>
        </div>
        <button
          className="btn primary"
          id="open-rollout"
          type="button"
          aria-haspopup="dialog"
          aria-controls="drawer"
          onClick={() => setDrawerOpen(true)}
        >
          开始升级流程
        </button>
      </div>
      <div className="notice top-notice">
        原型模式：页面使用演示数据，尚未连接服务器；升级与备份操作不会实际执行。
      </div>
      <div className="stats">
        <div className="stat">
          <div className="stat-top">
            <span>运行中容器</span>
            <span>●</span>
          </div>
          <div className="stat-value">
            18 <small>/ 20</small>
          </div>
          <div className="stat-note">↑ 2 个较上次检查</div>
        </div>
        <div className="stat">
          <div className="stat-top">
            <span>PHP 运行版本</span>
            <span>PHP</span>
          </div>
          <div className="stat-value">demo-7.4</div>
          <div className="stat-note warn">演示版本需要升级</div>
        </div>
        <div className="stat">
          <div className="stat-top">
            <span>数据库备份</span>
            <span>DB</span>
          </div>
          <div className="stat-value">昨天</div>
          <div className="stat-note">最近备份 02:00 · 1.8 GB</div>
        </div>
        <div className="stat">
          <div className="stat-top">
            <span>待处理升级</span>
            <span>!</span>
          </div>
          <div className="stat-value">6</div>
          <div className="stat-note warn">包含 2 个高风险项目</div>
        </div>
      </div>
      <div className="grid">
        <Panel title="服务状态">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>服务</th>
                  <th>镜像</th>
                  <th>状态</th>
                  <th>端口</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="service">
                        <div className="service-icon">{service.name[0]}</div>
                        <div>
                          <strong>{service.name}</strong>
                          <small>{service.container}</small>
                        </div>
                      </div>
                    </td>
                    <td>{service.image}</td>
                    <td>
                      <StatusTag state={service.state} label={service.stateLabel} />
                    </td>
                    <td>{service.port}</td>
                    <td>
                      <button
                        className="action-link"
                        type="button"
                        onClick={() => checkService(service.name)}
                      >
                        检查版本
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="最近活动" meta="演示数据 · 2 分钟前">
          <div className="activity">
            {activities.map((activity) => (
              <div className="event" key={activity.id}>
                <div className={`event-mark ${activity.tone}`}>{activity.icon}</div>
                <div>
                  <p>{activity.title}</p>
                  <time>{activity.time}</time>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel title="推荐升级计划" meta="演示环境 · 变更窗口建议 30 分钟" className="rollout">
        <div className="rollout-body">
          <div className="steps">
            <div className="step done">1　环境检查</div>
            <div className="step current">2　备份数据</div>
            <div className="step">3　灰度发布</div>
            <div className="step">4　健康验证</div>
          </div>
          <div className="plan">
            <div className="plan-item">
              <strong>EduServer PHP 运行时</strong>
              <span>demo-7.4 → demo-8.2 · 需要演示基础镜像和回滚标签</span>
            </div>
            <div className="plan-item">
              <strong>演示数据库</strong>
              <span>demo-5.7 → demo-8.0 · 必须先完成演示备份</span>
            </div>
            <div className="plan-item">
              <strong>Nginx Gateway</strong>
              <span>demo-alpine → 固定版本 digest · 低风险</span>
            </div>
            <div className="plan-item">
              <strong>管理后台</strong>
              <span>检查 demo-admin 最新稳定标签</span>
            </div>
          </div>
          <div className="notice">
            安全策略：浏览器只提交演示变更请求给运维代理；不会直接开放 Docker Socket。
          </div>
        </div>
      </Panel>
    </section>
  );
}
