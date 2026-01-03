import React, { useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';

const Dashboard = () => {
  const summaryCards = useMemo(() => ([
    { label: 'My Tasks', value: 12, accent: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { label: 'Due This Week', value: 5, accent: 'bg-amber-100 text-amber-700 border-amber-200' },
    { label: 'Completed', value: 18, accent: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
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
            className={`rounded-xl border p-6 shadow-sm ${card.accent}`}
          >
            <p className="text-xs uppercase tracking-wide">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Updated task "Design review"</li>
            <li>• Commented on project roadmap</li>
            <li>• Marked "Client onboarding" as complete</li>
          </ul>
        </div>
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Upcoming Deadlines</h3>
          <ul className="space-y-2 text-sm text-slate-600">
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
