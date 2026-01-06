import React from 'react';

const TaskFilters = ({
  projects,
  users,
  selectedProjectId,
  selectedAssigneeId,
  onProjectChange,
  onAssigneeChange,
  onCreateTask,
}) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex flex-col gap-3 sm:flex-row">
      <select
        value={selectedProjectId}
        onChange={(event) => onProjectChange(event.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
      >
        <option value="">All Projects</option>
        {projects.map((project) => (
          <option key={project.projectId} value={project.projectId}>
            {project.projectName}
          </option>
        ))}
      </select>
      <select
        value={selectedAssigneeId}
        onChange={(event) => onAssigneeChange(event.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
      >
        <option value="">All Assignees</option>
        {users.map((user) => (
          <option key={user.userId} value={user.userId}>
            {`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email || `User #${user.userId}`}
          </option>
        ))}
      </select>
    </div>
    <button
      type="button"
      onClick={onCreateTask}
      className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:hover:bg-indigo-500"
    >
      New Task
    </button>
  </div>
);

export default TaskFilters;
