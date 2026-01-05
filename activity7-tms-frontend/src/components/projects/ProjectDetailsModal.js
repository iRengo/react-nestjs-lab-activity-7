import React from 'react';

const ProjectDetailsModal = ({project, statusLabels, formatDate, resolveCreatorName, onClose}) => {
  if (!project) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Project Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 transition hover:text-slate-700 focus:outline-none dark:text-slate-300 dark:hover:text-slate-100"
          >
            Close
          </button>
        </div>
        <div className="space-y-4 px-6 py-5 text-sm text-slate-700 dark:text-slate-200">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Project</p>
            <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{project.projectName}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</p>
            <p className="mt-1">{statusLabels[project.status] ?? project.status}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Created By</p>
            <p className="mt-1">{resolveCreatorName(project)}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Start Date</p>
              <p className="mt-1">{formatDate(project.startDate)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">End Date</p>
              <p className="mt-1">{formatDate(project.endDate)}</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Description</p>
            <p className="mt-1 whitespace-pre-line">{project.projectDescription || 'No description provided.'}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Created At</p>
              <p className="mt-1">{formatDate(project.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Updated At</p>
              <p className="mt-1">{formatDate(project.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
