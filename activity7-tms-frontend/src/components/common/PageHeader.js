import React from 'react';

const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-700">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-500 dark:text-slate-300">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
};

export default PageHeader;
