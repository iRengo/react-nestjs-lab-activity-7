import React, {useEffect, useMemo, useState} from 'react';
import PageHeader from '../../components/common/PageHeader';
import useAssignedWork from '../../hooks/useAssignedWork';
import {updateTask} from '../../services/taskService';
import {getDateOrNull, normalizeStatus} from './utils/taskMetrics';
import {formatStatusLabel, getPriorityBadgeClasses, getPriorityLabel, getStatusBadgeClasses} from '../../utils/badgeStyles';

const STATUS_CHOICES = [
  {value: 'ongoing', label: 'Ongoing'},
  {value: 'completed', label: 'Completed'},
];

const TASKS_PER_PAGE = 5;

const STATUS_BUTTON_BASE_CLASSES = 'rounded-md px-3 py-1 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60';
const STATUS_BUTTON_ACTIVE_CLASSES = 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-500';
const STATUS_BUTTON_INACTIVE_CLASSES = 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-200';

const mapStatusToOption = (status) => {
  const normalized = normalizeStatus(status);

  if (['completed', 'complete', 'done', 'resolved'].includes(normalized)) {
    return 'completed';
  }

  if (['in progress', 'ongoing', 'active', 'processing'].includes(normalized)) {
    return 'ongoing';
  }

  return 'ongoing';
};

const formatDueDate = (value) => {
  const date = getDateOrNull(value);

  if (!date) {
    return 'No due date';
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const isTaskOverdue = (task) => {
  const status = normalizeStatus(task.status);

  if (status === 'completed') {
    return false;
  }

  const due = getDateOrNull(task.dueDate);

  if (!due) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
};

const Tasks = () => {
  const {tasks: assignedTasks, isLoading, error, reload} = useAssignedWork();
  const [statusSelections, setStatusSelections] = useState({});
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskPage, setTaskPage] = useState(1);
  const taskCount = assignedTasks.length;

  useEffect(() => {
    if (!selectedTask) {
      return;
    }

    const refreshed = assignedTasks.find((task) => task.taskId === selectedTask.taskId);

    if (!refreshed) {
      setSelectedTask(null);
      return;
    }

    if (refreshed.status !== selectedTask.status || refreshed.updatedAt !== selectedTask.updatedAt) {
      setSelectedTask(refreshed);
    }
  }, [assignedTasks, selectedTask]);

  useEffect(() => {
    if (!actionError && !actionSuccess) {
      return;
    }

    const timer = setTimeout(() => {
      setActionError('');
      setActionSuccess('');
    }, 4000);

    return () => clearTimeout(timer);
  }, [actionError, actionSuccess]);

  const orderedTasks = useMemo(() => {
    return assignedTasks
      .slice()
      .sort((a, b) => {
        const aDue = getDateOrNull(a.dueDate);
        const bDue = getDateOrNull(b.dueDate);
        const aTime = aDue?.getTime() ?? Number.POSITIVE_INFINITY;
        const bTime = bDue?.getTime() ?? Number.POSITIVE_INFINITY;

        if (aTime === bTime) {
          const aCreated = getDateOrNull(a.createdAt) ?? new Date(0);
          const bCreated = getDateOrNull(b.createdAt) ?? new Date(0);
          return (bCreated?.getTime() ?? 0) - (aCreated?.getTime() ?? 0);
        }

        return aTime - bTime;
      });
  }, [assignedTasks]);

  const totalTaskPages = useMemo(
    () => Math.max(1, Math.ceil(orderedTasks.length / TASKS_PER_PAGE)),
    [orderedTasks.length],
  );

  useEffect(() => {
    setTaskPage(1);
  }, [taskCount]);

  useEffect(() => {
    if (taskPage > totalTaskPages) {
      setTaskPage(totalTaskPages);
    }
  }, [taskPage, totalTaskPages]);

  const paginatedTasks = useMemo(() => {
    const start = (taskPage - 1) * TASKS_PER_PAGE;
    return orderedTasks.slice(start, start + TASKS_PER_PAGE);
  }, [orderedTasks, taskPage]);

  const handleStatusChange = async (task, nextStatus) => {
    if (updatingTaskId === task.taskId) {
      return;
    }

    const currentStatus = statusSelections[task.taskId] ?? mapStatusToOption(task.status);

    if (currentStatus === nextStatus) {
      return;
    }

    setStatusSelections((previous) => ({
      ...previous,
      [task.taskId]: nextStatus,
    }));

    setUpdatingTaskId(task.taskId);
    setActionError('');
    setActionSuccess('');

    try {
      await updateTask(task.taskId, {status: nextStatus});
      const label = STATUS_CHOICES.find((option) => option.value === nextStatus)?.label ?? nextStatus;
      setActionSuccess(`Task status updated to ${label}.`);
      if (selectedTask?.taskId === task.taskId) {
        setSelectedTask((prev) => (prev ? {...prev, status: nextStatus} : prev));
      }
      await reload();
      setStatusSelections((previous) => {
        const nextSelections = {...previous};
        delete nextSelections[task.taskId];
        return nextSelections;
      });
    } catch (updateError) {
      setActionError(updateError?.message ?? 'Unable to update task status.');
      setStatusSelections((previous) => {
        const nextSelections = {...previous};
        delete nextSelections[task.taskId];
        return nextSelections;
      });
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const openTaskDetails = (task) => {
    setSelectedTask(task);
  };

  const closeTaskDetails = () => {
    setSelectedTask(null);
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="My Tasks"
        subtitle="Monitor progress and upcoming deadlines."
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

      {actionSuccess ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200">
          {actionSuccess}
        </div>
      ) : null}

      {actionError && !error ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
          {actionError}
        </div>
      ) : null}

      <div className="space-y-3">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            Loading tasks…
          </div>
        ) : orderedTasks.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            No tasks assigned yet.
          </div>
        ) : (
          paginatedTasks.map((task) => {
            const currentOption = mapStatusToOption(task.status);
            const statusValue = statusSelections[task.taskId] ?? currentOption;
            const statusLabel = formatStatusLabel(statusSelections[task.taskId] ?? task.status);
            const statusClasses = getStatusBadgeClasses(statusValue);
            const priorityLabel = getPriorityLabel(task.priority);

            const priorityClasses = getPriorityBadgeClasses(task.priority);
            const overdue = isTaskOverdue(task);

            return (
              <div
                key={task.taskId}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500/40 dark:hover:bg-slate-800/60"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{task.taskTitle ?? 'Untitled task'}</p>
                    <p className={`text-xs ${overdue ? 'text-red-600 dark:text-red-300 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>{formatDueDate(task.dueDate)}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{task.project?.projectName ?? 'No project linked'}</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <span className={`inline-flex min-w-[8rem] justify-center rounded-full px-3 py-1 text-xs font-medium capitalize ${statusClasses}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      {STATUS_CHOICES.map((option) => {
                        const isActive = statusValue === option.value;
                        const isSaving = updatingTaskId === task.taskId && statusSelections[task.taskId] === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleStatusChange(task, option.value)}
                            disabled={updatingTaskId === task.taskId}
                            className={`${STATUS_BUTTON_BASE_CLASSES} ${isActive ? STATUS_BUTTON_ACTIVE_CLASSES : STATUS_BUTTON_INACTIVE_CLASSES}`}
                          >
                            {isSaving ? 'Updating…' : option.label}
                          </button>
                        );
                      })}
                    </div>
                    {priorityLabel ? (
                      <span className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${priorityClasses}`}>
                        Priority: {priorityLabel}
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => openTaskDetails(task)}
                    className="inline-flex items-center justify-center rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
                  >
                    View details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {!isLoading && orderedTasks.length > 0 ? (
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <span>Page {taskPage} of {totalTaskPages}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTaskPage((previous) => Math.max(previous - 1, 1))}
              disabled={taskPage <= 1}
              className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setTaskPage((previous) => Math.min(previous + 1, totalTaskPages))}
              disabled={taskPage >= totalTaskPages}
              className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}

      {selectedTask ? (
        <TaskDetailsModal
          task={selectedTask}
          assignedTasks={assignedTasks}
          statusValue={statusSelections[selectedTask.taskId] ?? mapStatusToOption(selectedTask.status)}
          onChangeStatus={(value) => handleStatusChange(selectedTask, value)}
          isUpdating={updatingTaskId === selectedTask.taskId}
          onClose={closeTaskDetails}
        />
      ) : null}
    </section>
  );
};

export default Tasks;

const TaskDetailsModal = ({task, assignedTasks, statusValue, onChangeStatus, isUpdating, onClose}) => {
  if (!task) {
    return null;
  }

  const project = task.project ?? {};
  const resolvedStatus = statusValue ?? task.status;
  const statusLabel = formatStatusLabel(resolvedStatus);
  const statusClasses = getStatusBadgeClasses(resolvedStatus);
  const priorityLabel = getPriorityLabel(task.priority);
  const priorityClasses = getPriorityBadgeClasses(task.priority);
  const projectTasks = assignedTasks.filter((item) => item.projectId === task.projectId);
  const upcomingText = projectTasks.length > 0
    ? `${projectTasks.length} ${projectTasks.length === 1 ? 'related task' : 'related tasks'}`
    : 'No related tasks assigned.';
  const overdue = isTaskOverdue(task);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4 py-6"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Task details</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{project.projectName ?? 'No project linked'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-400"
          >
            Close
          </button>
        </header>
        <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
          <section className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClasses}`}>
                {statusLabel}
              </span>
              {priorityLabel ? (
                <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${priorityClasses}`}>
                  Priority: {priorityLabel}
                </span>
              ) : null}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{task.taskTitle ?? 'Untitled task'}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">{task.taskDescription || 'No description provided.'}</p>
            </div>
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Due date</dt>
                <dd className={overdue ? 'text-red-600 dark:text-red-300 font-semibold' : 'text-slate-700 dark:text-slate-200'}>{formatDueDate(task.dueDate)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Assigned to</dt>
                <dd className="text-slate-700 dark:text-slate-200">You</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Project status</dt>
                <dd className="text-slate-700 dark:text-slate-200">{project.status ?? 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Project timeline</dt>
                <dd className="text-slate-700 dark:text-slate-200">
                  {project.startDate ? formatDueDate(project.startDate) : '—'}
                  {' '}–{' '}
                  {project.endDate ? formatDueDate(project.endDate) : '—'}
                </dd>
              </div>
            </dl>
          </section>
          <section className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Project overview</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">{project.projectDescription || 'No project description provided.'}</p>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Related tasks</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{upcomingText}</p>
            </div>
            {projectTasks.length > 0 ? (
              <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-700">
                {projectTasks.map((relatedTask) => (
                  <li key={relatedTask.taskId} className="flex flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className={`font-medium ${relatedTask.taskId === task.taskId ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>
                        {relatedTask.taskTitle ?? 'Untitled task'}
                      </p>
                        <p className={`text-xs ${isTaskOverdue(relatedTask) ? 'text-red-600 dark:text-red-300 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>Due {formatDueDate(relatedTask.dueDate)}</p>
                    </div>
                    <span className={`inline-flex min-w-[6rem] justify-center rounded-full px-2 py-1 text-[10px] font-semibold capitalize ${getStatusBadgeClasses(relatedTask.status)}`}>
                      {formatStatusLabel(relatedTask.status)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        </div>
        <footer className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Update status</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_CHOICES.map((option) => {
                const isActive = statusValue === option.value;
                const isSaving = isUpdating && statusValue === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onChangeStatus(option.value)}
                    disabled={isUpdating}
                    className={`${STATUS_BUTTON_BASE_CLASSES} ${isActive ? STATUS_BUTTON_ACTIVE_CLASSES : STATUS_BUTTON_INACTIVE_CLASSES}`}
                  >
                    {isSaving ? 'Updating…' : option.label}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-400"
          >
            Done
          </button>
        </footer>
      </div>
    </div>
  );
};
