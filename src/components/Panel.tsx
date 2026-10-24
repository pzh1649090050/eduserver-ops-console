import type { ReactNode } from 'react';

type PanelProps = {
  title: string;
  meta?: string;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, meta, children, className = '' }: PanelProps) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-head">
        <h2>{title}</h2>
        {meta && <small>{meta}</small>}
      </div>
      {children}
    </section>
  );
}
