import React from 'react';
import {formatStatusLabel, getStatusBadgeClasses} from '../../utils/badgeStyles';

const isProjectOverdue = (project) => {
  const status = (project.status ?? '').toString().toLowerCase();

  if (status === 'completed') {
    return false;
  }

  if (!project.endDate) {
    return false;
  }

  const endDate = new Date(project.endDate);

  if (Number.isNaN(endDate.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  return endDate.getTime() < today.getTime();
};
const ProjectsTable = ({
  projects,
  isFetching,
  statusLabels,
  formatDate,
  resolveCreatorName,
  projectProgress,
  page = 1,
  totalPages = 1,
  onPreviousPage,
  onNextPage,
  deletingId,
  onEditProject,
  onViewProject,
  onNavigateToTasks,
  onDeleteProject,
  onMarkProjectComplete,
  markingProjectId,
}) => {
  const currentPage = Math.min(page, totalPages);
  const maxPages = Math.max(totalPages, 1);
  const previousHandler = onPreviousPage ?? (() => {});
  const nextHandler = onNextPage ?? (() => {});

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
      <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        <tr>
          <th className="px-6 py-3">Project</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3">Start</th>
          <th className="px-6 py-3">End</th>
          <th className="px-6 py-3">Created By</th>
          <th className="px-6 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 text-sm text-slate-600 dark:divide-slate-800 dark:text-slate-300">
        {isFetching ? (
          <tr>
            <td colSpan={6} className="px-6 py-5 text-center text-sm text-slate-500 dark:text-slate-400">
              Loading projects...
            </td>
          </tr>
        ) : projects.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-6 py-5 text-center text-sm text-slate-500 dark:text-slate-400">
              No projects found.
            </td>
          </tr>
        ) : (
          projects.map((project) => {
            const statusLabel = statusLabels?.[project.status] ?? formatStatusLabel(project.status);
            const statusClasses = getStatusBadgeClasses(project.status);
            const overdue = isProjectOverdue(project);

            return (
              <tr key={project.projectId} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  <div className="space-y-2">
                    <p className={overdue ? 'text-red-600 dark:text-red-300' : undefined}>{project.projectName}</p>
                    <ProjectProgressBar projectId={project.projectId} projectProgress={projectProgress} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex min-w-[6rem] justify-center rounded-full px-3 py-1 text-xs font-medium capitalize ${statusClasses}`}>
                    {statusLabel}
                  </span>
                </td>
                <td className="px-6 py-4">{formatDate(project.startDate)}</td>
                <td className={`px-6 py-4 ${overdue ? 'text-red-600 dark:text-red-300 font-semibold' : ''}`}>{formatDate(project.endDate)}</td>
                <td className="px-6 py-4">{resolveCreatorName(project)}</td>
                <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  {onMarkProjectComplete ? (
                    <ProjectCompleteButton
                      project={project}
                      projectProgress={projectProgress}
                      onMarkComplete={onMarkProjectComplete}
                      markingProjectId={markingProjectId}
                    />
                  ) : null}
                  {onEditProject ? (
                    <button
                      type="button"
                      onClick={() => onEditProject(project)}
                      className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
                    >
                      Edit
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onViewProject(project)}
                    className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToTasks(project.projectId)}
                    className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
                  >
                    Tasks
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === project.projectId}
                    onClick={() => onDeleteProject(project.projectId)}
                    className="rounded-md border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-600 shadow-sm transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-700 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-900/30"
                  >
                    {deletingId === project.projectId ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
      </table>
      <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
      <span>Page {currentPage} of {maxPages}</span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={previousHandler}
          disabled={currentPage <= 1}
          className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={nextHandler}
          disabled={currentPage >= maxPages}
          className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
        >
          Next
        </button>
      </div>
      </div>
    </div>
  );
};

const ProjectProgressBar = ({projectId, projectProgress}) => {
  const info = projectProgress?.get(projectId) ?? {raw: 0, step: 0, colorClass: 'bg-slate-300 dark:bg-slate-700'};
  const widthPercentage = Math.min(Math.max(info.raw, 0), 100);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Progress</span>
        <span>{widthPercentage}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`${info.colorClass} h-2 transition-all`}
          style={{width: `${widthPercentage}%`}}
        />
      </div>
    </div>
  );
};

const ProjectCompleteButton = ({project, projectProgress, onMarkComplete, markingProjectId}) => {
  const info = projectProgress?.get(project.projectId);
  const totalTasks = info?.total ?? 0;
  const completedTasks = info?.completed ?? 0;
  const hasIncompleteTasks = totalTasks > 0 && completedTasks < totalTasks;
  const normalizedStatus = (project.status ?? '').toString().toLowerCase();
  const isAlreadyCompleted = normalizedStatus === 'completed';
  const isMarking = markingProjectId === project.projectId;
  const disabled = hasIncompleteTasks || isAlreadyCompleted || isMarking;
  const title = hasIncompleteTasks
    ? 'Complete all project tasks before marking as completed.'
    : isAlreadyCompleted
      ? 'This project is already completed.'
      : undefined;

  return (
    <button
      type="button"
      onClick={() => onMarkComplete(project)}
      disabled={disabled}
      title={title}
      className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:border-emerald-400 dark:hover:bg-emerald-500/20"
    >
      {isMarking ? 'Marking…' : 'Mark completed'}
    </button>
  );
};

export default ProjectsTable;
