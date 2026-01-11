import React, { useState } from 'react';

const CreateProjectModal = ({
  isOpen,
  formState,
  statusLabels,
  isSubmitting,
  onClose,
  onChange,
  onSubmit,
  mode = 'create',
}) => {
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    // Description validation
    if (!formState.projectDescription?.trim()) {
      newErrors.projectDescription = 'This field is required';
    } else if (formState.projectDescription.length > 500) {
      newErrors.projectDescription = 'Description must not exceed 500 characters';
    }

    if (!formState.projectName?.trim()) {
      newErrors.projectName = 'This field is required';
    }

    if (!formState.startDate) {
      newErrors.startDate = 'This field is required';
    }

    if (!formState.endDate) {
      newErrors.endDate = 'This field is required';
    }

    if (
      formState.startDate &&
      formState.endDate &&
      new Date(formState.endDate) < new Date(formState.startDate)
    ) {
      newErrors.endDate = 'End date cannot be before start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🧠 Intercept submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(e);
  };

  const inputBase =
    'mt-1 w-full rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 dark:bg-slate-800 dark:text-slate-100';

  const inputNormal =
    'border border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-600';

  const inputError =
    'border border-red-500 focus:border-red-500 focus:ring-red-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {mode === 'edit' ? 'Edit Project' : 'Create Project'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-300"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5" noValidate>
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              name="projectName"
              value={formState.projectName}
              onChange={onChange}
              className={`${inputBase} ${errors.projectName ? inputError : inputNormal
                }`}
            />
            {errors.projectName && (
              <p className="mt-1 text-xs text-red-500">{errors.projectName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="projectDescription"
              rows={3}
              value={formState.projectDescription}
              onChange={onChange}
              className={`${inputBase} ${errors.projectDescription ? inputError : inputNormal
                }`}
            />
            {errors.projectDescription && (
              <p className="mt-1 text-xs text-red-500">
                {errors.projectDescription}
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formState.startDate}
                onChange={onChange}
                className={`${inputBase} ${errors.startDate ? inputError : inputNormal
                  }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formState.endDate}
                onChange={onChange}
                className={`${inputBase} ${errors.endDate ? inputError : inputNormal
                  }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border px-4 py-2 text-sm text-slate-700 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-60"
            >
              {isSubmitting
                ? 'Saving...'
                : mode === 'edit'
                  ? 'Save Changes'
                  : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
