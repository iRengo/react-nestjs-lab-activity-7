import React, {useMemo} from 'react';
import PageHeader from '../../components/common/PageHeader';
import useAssignedWork from '../../hooks/useAssignedWork';
import {getDateOrNull, isTaskCompleted} from './utils/taskMetrics';

const Projects = () => {
  const {projects: assignedProjects, tasks: assignedTasks, isLoading, error, reload} = useAssignedWork();

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
              rows.map(({project, progress, totalAssigned, completedAssigned, dueSoonest}) => (
                <tr key={project.projectId} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    <div>{project.projectName ?? 'Untitled project'}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Status: {(project.status ?? 'pending').toString()}</div>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Projects;
