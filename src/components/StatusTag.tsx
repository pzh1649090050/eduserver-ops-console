import type { ServiceState } from '../mocks/types';

export function StatusTag({ state, label }: { state: ServiceState | 'off'; label: string }) {
  return (
    <span className={`tag ${state}`}>
      <i className="dot" />
      {label}
    </span>
  );
}
