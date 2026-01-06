import React, {useEffect, useMemo, useState} from 'react';
import PageHeader from '../../components/common/PageHeader';
import useAssignedWork from '../../hooks/useAssignedWork';
import {getDateOrNull, isTaskCompleted} from './utils/taskMetrics';
import {formatStatusLabel, getStatusBadgeClasses} from '../../utils/badgeStyles';

const isProjectOverdue = (project) => {
  const status = (project.status ?? '').toString().toLowerCase();

  if (status === 'completed') {
    return false;
  }

  if (!project.endDate) {
    return false;
  }

  const endDate = getDateOrNull(project.endDate);

  if (!endDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return endDate.getTime() < today.getTime();
};

const ROWS_PER_PAGE = 5;

const Projects = () => {
  const {projects: assignedProjects, tasks: assignedTasks, isLoading, error, reload} = useAssignedWork();
  const [projectPage, setProjectPage] = useState(1);
  const projectCount = assignedProjects.length;

  const rows = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return assignedProjects.map((project) => {
      const tasksForProject = assignedTasks.filter((task) => task.projectId === project.projectId);
      const totalAssigned = tasksForProject.length;
      const completedAssigned = tasksForProject.filter((task) => isTaskCompleted(task.status)).length;
      const progress = totalAssigned === 0 ? 0 : Math.round((completedAssigned / totalAssigned) * 100);
      const dueSoonest = tasksForProject
        .map((task) => getDateOrNull(task.dueDate))
        .filter((date) => date && date >= startOfToday)
        .sort((a, b) => (a?.getTime() ?? 0) - (b?.getTime() ?? 0))[0];

      return {
        project,
        progress,
        totalAssigned,
        completedAssigned,
        dueSoonest,
      };
    });
  }, [assignedProjects, assignedTasks]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE)),
    [rows.length],
  );

  useEffect(() => {
    setProjectPage(1);
  }, [projectCount]);

  useEffect(() => {
    if (projectPage > totalPages) {
      setProjectPage(totalPages);
    }
  }, [projectPage, totalPages]);

  const paginatedRows = useMemo(() => {
    const start = (projectPage - 1) * ROWS_PER_PAGE;
    return rows.slice(start, start + ROWS_PER_PAGE);
  }, [rows, projectPage]);

  return (
    <section className="space-y-6">
      <PageHeader
        title="My Projects"
        subtitle="View the initiatives you are contributing to."
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

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Project</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Role</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-4 py-5 text-center text-sm text-slate-500 dark:text-slate-400">
                  Loading projects…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-5 text-center text-sm text-slate-500 dark:text-slate-400">
                  No projects assigned yet.
                </td>
              </tr>
            ) : (
              paginatedRows.map(({project, progress, totalAssigned, completedAssigned, dueSoonest}) => {
                const overdue = isProjectOverdue(project);

                return (
                <tr key={project.projectId} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    <div className={overdue ? 'text-red-600 dark:text-red-300' : undefined}>{project.projectName ?? 'Untitled project'}</div>
                    <span className={`mt-1 inline-flex min-w-[6rem] justify-center rounded-full px-2 py-1 text-[11px] font-semibold capitalize ${getStatusBadgeClasses(project.status)}`}>
                      {formatStatusLabel(project.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">Assignee</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{progress}% complete</span>
                      <span>{totalAssigned > 0 ? `${completedAssigned}/${totalAssigned} tasks` : 'No tasks assigned'}</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all dark:bg-indigo-400"
                        style={{width: `${progress}%`}}
                      />
                    </div>
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {dueSoonest
                        ? `Next due: ${dueSoonest.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}`
                        : 'No upcoming deadlines'}
                    </div>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>

        {!isLoading && rows.length > 0 ? (
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
            <span>Page {projectPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setProjectPage((previous) => Math.max(previous - 1, 1))}
                disabled={projectPage <= 1}
                className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setProjectPage((previous) => Math.min(previous + 1, totalPages))}
                disabled={projectPage >= totalPages}
                className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Projects;
