import React from 'react';
import {formatStatusLabel, getPriorityBadgeClasses, getPriorityLabel, getStatusBadgeClasses} from '../../utils/badgeStyles';

const isTaskOverdue = (task) => {
  const status = (task.status ?? '').toString().toLowerCase();

  if (['completed', 'complete', 'done'].includes(status)) {
    return false;
  }

  if (!task.dueDate) {
    return false;
  }

  const due = new Date(task.dueDate);

  if (Number.isNaN(due.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  return due.getTime() < today.getTime();
};

const TasksTable = ({
  tasks,
  isFetching,
  projectsLookup,
  usersLookup,
  formatDate,
  deletingId,
  page = 1,
  totalPages = 1,
  onPreviousPage,
  onNextPage,
  onEditTask,
  onDeleteTask,
  projectFilterEmpty = false,
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
          <th className="px-6 py-3">Task</th>
          <th className="px-6 py-3">Project</th>
          <th className="px-6 py-3">Assigned to</th>
          <th className="px-6 py-3">Priority</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3">Due</th>
          <th className="px-6 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 text-sm text-slate-600 dark:divide-slate-800 dark:text-slate-300">
        {isFetching ? (
          <tr>
            <td colSpan={7} className="px-6 py-5 text-center text-sm text-slate-500 dark:text-slate-400">
              Loading tasks...
            </td>
          </tr>
        ) : tasks.length === 0 ? (
          <tr>
            <td colSpan={7} className="px-6 py-5 text-center text-sm text-slate-500 dark:text-slate-400">
              {projectFilterEmpty ? 'No tasks found for this project.' : 'No tasks found.'}
            </td>
          </tr>
        ) : (
          tasks.map((task) => {
            const statusLabel = formatStatusLabel(task.status);
            const statusClasses = getStatusBadgeClasses(task.status);
            const priorityLabel = getPriorityLabel(task.priority);
            const priorityClasses = getPriorityBadgeClasses(task.priority);
            const overdue = isTaskOverdue(task);

            return (
              <tr key={task.taskId} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{task.taskTitle}</td>
                <td className="px-6 py-4">{projectsLookup.get(task.projectId) ?? '—'}</td>
                <td className="px-6 py-4">{(task.assignedTo && usersLookup.get(task.assignedTo)) || '—'}</td>
                <td className="px-6 py-4">
                  {priorityLabel ? (
                    <span className={`inline-flex min-w-[6rem] justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${priorityClasses}`}>
                      {priorityLabel}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex min-w-[6rem] justify-center rounded-full px-3 py-1 text-xs font-medium capitalize ${statusClasses}`}>
                    {statusLabel}
                  </span>
                </td>
                <td className={`px-6 py-4 ${overdue ? 'text-red-600 dark:text-red-300 font-semibold' : ''}`}>{formatDate(task.dueDate)}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEditTask(task)}
                      className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === task.taskId}
                      onClick={() => onDeleteTask(task.taskId)}
                      className="rounded-md border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-600 shadow-sm transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-700 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-900/30"
                    >
                      {deletingId === task.taskId ? 'Deleting...' : 'Delete'}
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

export default TasksTable;
