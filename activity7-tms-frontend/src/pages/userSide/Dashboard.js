import React, {useMemo} from 'react';
import PageHeader from '../../components/common/PageHeader';
import useAssignedWork from '../../hooks/useAssignedWork';
import {getDateOrNull, isTaskCompleted} from './utils/taskMetrics';
import {formatStatusLabel, getStatusBadgeClasses} from '../../utils/badgeStyles';

const Dashboard = () => {
  const {projects: assignedProjects, tasks: assignedTasks, isLoading, error, reload} = useAssignedWork();

  const summaryCards = useMemo(() => {
    const totalTasks = assignedTasks.length;
    const completedTasks = assignedTasks.filter((task) => isTaskCompleted(task.status)).length;
    const now = new Date();
    const weekAhead = new Date(now);
    weekAhead.setDate(weekAhead.getDate() + 7);

    const dueSoon = assignedTasks.filter((task) => {
      const dueDate = getDateOrNull(task.dueDate);
      return dueDate && dueDate >= now && dueDate <= weekAhead && !isTaskCompleted(task.status);
    }).length;

    const formatValue = (value) => (isLoading ? '—' : value);

    return [
      {
        label: 'My Tasks',
        value: formatValue(totalTasks),
        accent: 'border-indigo-200 bg-indigo-100 text-indigo-700',
        darkAccent: 'border-indigo-500/40 bg-indigo-500/20 text-indigo-200',
      },
      {
        label: 'Due This Week',
        value: formatValue(dueSoon),
        accent: 'border-amber-200 bg-amber-100 text-amber-700',
        darkAccent: 'border-amber-400/40 bg-amber-400/20 text-amber-200',
      },
      {
        label: 'Completed',
        value: formatValue(completedTasks),
        accent: 'border-emerald-200 bg-emerald-100 text-emerald-700',
        darkAccent: 'border-emerald-500/40 bg-emerald-500/20 text-emerald-200',
      },
    ];
  }, [assignedTasks, isLoading]);

  const recentActivity = useMemo(() => {
    return assignedTasks
      .slice()
      .sort((a, b) => {
        const aDate = getDateOrNull(a.updatedAt) ?? getDateOrNull(a.createdAt);
        const bDate = getDateOrNull(b.updatedAt) ?? getDateOrNull(b.createdAt);
        return (bDate?.getTime() ?? 0) - (aDate?.getTime() ?? 0);
      })
      .slice(0, 4);
  }, [assignedTasks]);

  const upcomingDeadlines = useMemo(() => {
    const today = new Date();

    return assignedTasks
      .filter((task) => {
        const dueDate = getDateOrNull(task.dueDate);
        return dueDate && dueDate >= today && !isTaskCompleted(task.status);
      })
      .sort((a, b) => {
        const aDue = getDateOrNull(a.dueDate);
        const bDue = getDateOrNull(b.dueDate);
        return (aDue?.getTime() ?? Number.POSITIVE_INFINITY) - (bDue?.getTime() ?? Number.POSITIVE_INFINITY);
      })
      .slice(0, 3);
  }, [assignedTasks]);

  return (
    <section className="space-y-6">
      <PageHeader
        title="My Dashboard"
        subtitle="Track your work, deadlines, and recent activity."
        actions={error ? (
          <button
            type="button"
            onClick={reload}
            className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:border-rose-500/50 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20"
          >
            Retry
          </button>
        ) : null}
      />

      {error ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-900/40 dark:text-rose-200">
          {error}
        </div>
      ) : null}

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
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Assigned Tasks</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">{isLoading ? 'Loading…' : `${recentActivity.length} updates`}</span>
          </div>
          {recentActivity.length === 0 && !isLoading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No recent updates yet.</p>
          ) : (
            <ul className="max-h-64 space-y-2 overflow-y-auto pr-1 text-sm text-slate-600 dark:text-slate-300">
              {recentActivity.map((task) => {
                const projectName = task.project?.projectName ?? 'Unnamed project';
                const statusLabel = formatStatusLabel(task.status);
                const statusClasses = getStatusBadgeClasses(task.status);

                return (
                  <li key={task.taskId} className="space-y-1 leading-snug">
                    <div className="flex flex-col">
                      <span className="truncate font-medium text-slate-900 dark:text-white">{task.taskTitle}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{projectName}</span>
                    </div>
                    <span className={`inline-flex min-w-[6rem] justify-center rounded-full px-2 py-1 text-[11px] font-semibold capitalize ${statusClasses}`}>
                      {statusLabel}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Upcoming Deadlines</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">{isLoading ? 'Loading…' : `${upcomingDeadlines.length} tasks`}</span>
          </div>
          {upcomingDeadlines.length === 0 && !isLoading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming deadlines.</p>
          ) : (
            <ul className="max-h-64 space-y-2 overflow-y-auto pr-1 text-sm text-slate-600 dark:text-slate-300">
              {upcomingDeadlines.map((task) => {
                const dueDate = getDateOrNull(task.dueDate);
                const formattedDue = dueDate
                  ? dueDate.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })
                  : 'No due date';
                return (
                  <li key={task.taskId} className="leading-snug">
                    <span className="truncate font-medium text-slate-900 dark:text-white">{task.taskTitle}</span>
                    <div className="text-xs text-slate-400 dark:text-slate-500">Due {formattedDue}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Assigned Projects</h3>
        {isLoading ? (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Loading projects…</p>
        ) : assignedProjects.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No projects assigned yet.</p>
        ) : (
          <ul className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2 lg:grid-cols-3">
            {assignedProjects.map((project) => (
              <li key={project.projectId} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800/70">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{project.projectName ?? 'Untitled project'}</p>
                <span className={`mt-2 inline-flex min-w-[6rem] justify-center rounded-full px-2 py-1 text-[11px] font-semibold capitalize ${getStatusBadgeClasses(project.status)}`}>
                  {formatStatusLabel(project.status)}
                </span>
              </li>
              ))}
            </ul>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
