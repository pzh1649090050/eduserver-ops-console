import { useCallback, useEffect, useRef, useState } from 'react';
import { demoAdapter } from '../adapter/demoAdapter';
import { useConsoleStore } from '../state/useConsoleStore';

const checks = [
  ['确认当前 PHP 版本', '检测结果：PHP demo-7.4 · 演示运行时'],
  ['创建并校验数据库备份', '执行演示备份，完成后才允许发布'],
  ['选择目标镜像', 'eduserver:demo-1.9 · PHP demo-8.2 · 待健康检查'],
  ['确认回滚方案', '保留 eduserver:demo-1.8，异常时恢复演示标签'],
];

export function UpgradeDrawer() {
  const { isDrawerOpen, setDrawerOpen, setStatusMessage } = useConsoleStore();
  const [checked, setChecked] = useState([true, false, false, false]);
  const [taskStatus, setTaskStatus] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => {
    setDrawerOpen(false);
    setTaskStatus('');
  }, [setDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    cardRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close, isDrawerOpen]);

  if (!isDrawerOpen) return null;
  const submit = async () => {
    if (checked.some((value) => !value)) {
      setTaskStatus('请完成全部检查项后再运行演示。');
      return;
    }
    const message = await demoAdapter.submitRollout();
    setTaskStatus(message);
    setStatusMessage(message);
  };
  return (
    <div
      className="drawer open"
      id="drawer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="drawer-card" ref={cardRef} tabIndex={-1}>
        <div className="drawer-head">
          <h2 id="drawer-title">准备升级 EduServer</h2>
          <button className="close" type="button" aria-label="关闭升级流程" onClick={close}>
            ×
          </button>
        </div>
        <p className="muted-copy">请按顺序完成检查。演示数据库迁移不会与 PHP 容器更新自动绑定。</p>
        {checks.map(([title, description], index) => (
          <label className="check" key={title}>
            <input
              type="checkbox"
              checked={checked[index]}
              onChange={(event) =>
                setChecked((current) =>
                  current.map((value, item) => (item === index ? event.target.checked : value)),
                )
              }
            />
            <span>
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
          </label>
        ))}
        <div className="code">
          # 代理将执行的演示摘要{`\n`}docker compose pull demo-pc-server{`\n`}docker compose up -d
          --no-deps demo-pc-server{`\n`}docker exec &lt;demo-container&gt; php -v
        </div>
        <div className="drawer-actions">
          <button className="btn" type="button" onClick={close}>
            取消
          </button>
          <button className="btn primary" type="button" onClick={submit}>
            模拟提交
          </button>
        </div>
        <p className="task-status" role="status" aria-live="polite">
          {taskStatus}
        </p>
        <p className="safety-copy">当前页面没有连接运维代理，不会执行服务器变更。</p>
      </div>
    </div>
  );
}
