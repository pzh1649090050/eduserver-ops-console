import { useConsoleStore } from '../../state/useConsoleStore';
import { Panel } from '../../components/Panel';

export function RolloutView() {
  const setDrawerOpen = useConsoleStore((state) => state.setDrawerOpen);
  return (
    <section className="content" data-view="rollout" id="rollout-view">
      <div className="heading">
        <div>
          <h1>升级发布</h1>
          <p>按环境检查、备份、灰度发布和健康验证顺序推进变更。</p>
        </div>
        <button className="btn primary" type="button" onClick={() => setDrawerOpen(true)}>
          开始升级流程
        </button>
      </div>
      <div className="metric-grid">
        <div className="metric">
          <span>当前阶段</span>
          <strong>备份数据</strong>
          <span>等待操作员确认</span>
        </div>
        <div className="metric">
          <span>变更窗口</span>
          <strong>30 分钟</strong>
          <span>演示时间段 02:00 - 02:30</span>
        </div>
        <div className="metric">
          <span>回滚标签</span>
          <strong>demo-1.8</strong>
          <span>已保留演示版本</span>
        </div>
      </div>
      <Panel title="发布前检查" meta="4 项检查 · 0 项已完成">
        <div className="rollout-body">
          <div className="steps">
            <div className="step done">1　环境检查</div>
            <div className="step current">2　备份数据</div>
            <div className="step">3　灰度发布</div>
            <div className="step">4　健康验证</div>
          </div>
          <p className="status-text">
            当前为演示流程。完成检查后只会显示模拟提交结果，不会执行服务器变更。
          </p>
          <div className="progress-line">
            <span style={{ width: '25%' }} />
          </div>
          <button
            className="btn primary"
            type="button"
            onClick={() => setDrawerOpen(true)}
            style={{ marginTop: 20 }}
          >
            打开检查清单
          </button>
        </div>
      </Panel>
    </section>
  );
}
