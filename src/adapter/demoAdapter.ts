import type { BackupRecord } from '../mocks/types';

const wait = (duration = 350) => new Promise((resolve) => window.setTimeout(resolve, duration));

export const demoAdapter = {
  async checkVersion(label: string) {
    await wait();
    return `${label} 的演示检查已完成；未访问服务器。`;
  },

  async createBackup(): Promise<BackupRecord> {
    await wait(500);
    return {
      id: `backup-${Date.now()}`,
      time: '刚刚',
      target: '演示数据库',
      size: '1.8 GB',
      retention: '30 天后',
      verified: true,
    };
  },

  async submitRollout() {
    await wait(400);
    return '演示完成：当前页面没有连接运维代理，不会执行服务器变更。';
  },
};
