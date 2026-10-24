import { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { Panel } from '../../components/Panel';
import { StatusTag } from '../../components/StatusTag';
import { demoAdapter } from '../../adapter/demoAdapter';
import { backups as initialBackups } from '../../mocks/data';
import type { BackupRecord } from '../../mocks/types';
import { useConsoleStore } from '../../state/useConsoleStore';

export function BackupsView() {
  const [backups, setBackups] = useState(initialBackups);
  const { setStatusMessage } = useConsoleStore();
  const createBackup = async () => {
    const backup = await demoAdapter.createBackup();
    setBackups((current) => [backup, ...current]);
    setStatusMessage('已创建一条演示备份记录；未执行数据库备份。');
  };
  const verify = (backup: BackupRecord) => {
    setStatusMessage(`${backup.target} 的演示校验已完成；未读取真实备份。`);
  };
  return (
    <section className="content" data-view="backups" id="backups-view">
      <div className="heading">
        <div>
          <h1>备份记录</h1>
          <p>查看最近备份、校验结果和保留周期。</p>
        </div>
        <button className="btn primary" type="button" onClick={createBackup}>
          模拟创建备份
        </button>
      </div>
      <Panel title="数据库备份" meta="保留周期 30 天">
        <DataTable headers={['时间', '目标', '大小', '校验', '保留至', '操作']}>
          {backups.map((backup) => (
            <tr key={backup.id}>
              <td>{backup.time}</td>
              <td>{backup.target}</td>
              <td>{backup.size}</td>
              <td>
                <StatusTag
                  state={backup.verified ? 'ok' : 'warning'}
                  label={backup.verified ? '已验证' : '待验证'}
                />
              </td>
              <td>{backup.retention}</td>
              <td>
                <button className="action-link" type="button" onClick={() => verify(backup)}>
                  重新校验
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </section>
  );
}
