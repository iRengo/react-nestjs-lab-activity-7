import React, { useState } from 'react';

const TaskModal = ({
  isOpen,
  mode = 'create',
  formState,
  isSubmitting,
  projects,
  users = [],
  onClose,
  onChange,
  onSubmit,
}) => {
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = {};

    if (!formState.taskTitle?.trim()) {
      newErrors.taskTitle = 'Title is required';
    }

    if (!formState.projectId) {
      newErrors.projectId = 'Project is required';
    }

    if (!formState.taskDescription?.trim()) {
      newErrors.taskDescription = 'Description is required';
    }

    if (!formState.priority) {
      newErrors.priority = 'Priority is required';
    }

    if (!formState.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(e);
  };

  // ---------------- INPUT CLASS ----------------
  const inputClass = (field) =>
    `mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
      errors[field]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-slate-300 focus:ring-indigo-500 dark:border-slate-600'
    } dark:bg-slate-800 dark:text-slate-100`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-base font-semibold">
            {mode === 'edit' ? 'Edit Task' : 'Create Task'}
          </h2>
          <button onClick={onClose} className="text-sm text-slate-500">
            Close
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Title & Project */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                name="taskTitle"
                value={formState.taskTitle}
                onChange={onChange}
                className={inputClass('taskTitle')}
              />
              {errors.taskTitle && (
                <p className="text-xs text-red-500 mt-1">{errors.taskTitle}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Project</label>
              <select
                name="projectId"
                value={formState.projectId}
                onChange={onChange}
                className={inputClass('projectId')}
              >
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p.projectId} value={p.projectId}>
                    {p.projectName}
                  </option>
                ))}
              </select>
              {errors.projectId && (
                <p className="text-xs text-red-500 mt-1">{errors.projectId}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="taskDescription"
              rows={3}
              value={formState.taskDescription}
              onChange={onChange}
              className={inputClass('taskDescription')}
            />
            {errors.taskDescription && (
              <p className="text-xs text-red-500 mt-1">
                {errors.taskDescription}
              </p>
            )}
          </div>

          {/* Assigned / Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Assigned To</label>
              <select
                name="assignedTo"
                value={formState.assignedTo}
                onChange={onChange}
                className={inputClass()}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.userId} value={u.userId}>
                    {`${u.firstName} ${u.lastName}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <select
                name="priority"
                value={formState.priority}
                onChange={onChange}
                className={inputClass('priority')}
              >
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority && (
                <p className="text-xs text-red-500 mt-1">{errors.priority}</p>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div className="md:w-1/2">
            <label className="text-sm font-medium">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formState.dueDate}
              onChange={onChange}
              className={inputClass('dueDate')}
            />
            {errors.dueDate && (
              <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
