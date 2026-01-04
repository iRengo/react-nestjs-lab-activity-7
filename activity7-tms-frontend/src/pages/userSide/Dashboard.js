import React, { useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';

const Dashboard = () => {
  const summaryCards = useMemo(() => ([
    {
      label: 'My Tasks',
      value: 12,
      accent: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      darkAccent: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40',
    },
    {
      label: 'Due This Week',
      value: 5,
      accent: 'bg-amber-100 text-amber-700 border-amber-200',
      darkAccent: 'bg-amber-400/20 text-amber-200 border-amber-400/40',
    },
    {
      label: 'Completed',
      value: 18,
      accent: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      darkAccent: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
    },
  ]), []);

  return (
    <section className="space-y-6">
      <PageHeader
        title="My Dashboard"
        subtitle="Track your work, deadlines, and recent activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border p-6 shadow-sm transition-colors ${card.accent} dark:${card.darkAccent}`}
          >
            <p className="text-xs uppercase tracking-wide text-slate-700 dark:text-slate-200">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>• Updated task "Design review"</li>
            <li>• Commented on project roadmap</li>
            <li>• Marked "Client onboarding" as complete</li>
          </ul>
        </div>
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Upcoming Deadlines</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>• Marketing assets - due in 2 days</li>
            <li>• Final QA review - due in 4 days</li>
            <li>• Sprint demo - due in 5 days</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
