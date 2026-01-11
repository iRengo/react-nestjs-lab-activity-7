const normalize = (value) => (value ?? '').toString().trim().toLowerCase();

const statusGroups = {
  completed: ['completed', 'complete', 'done', 'resolved'],
  ongoing: ['in progress', 'ongoing', 'active', 'processing'],
  critical: ['blocked', 'delayed', 'stuck', 'overdue'],
  review: ['for review', 'review', 'for_review'],
};

const statusClassMap = {
  completed: 'border border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-500/60 dark:bg-emerald-500/20 dark:text-emerald-200',
  ongoing: 'border border-indigo-200 bg-indigo-100 text-indigo-700 dark:border-indigo-500/60 dark:bg-indigo-500/20 dark:text-indigo-200',
  critical: 'border border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-500/60 dark:bg-rose-500/20 dark:text-rose-200',
  review: 'border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-500/60 dark:bg-blue-500/20 dark:text-blue-200',
  default: 'border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-200',
};

const statusLabelMap = {
  pending: 'Pending',
  ongoing: 'Ongoing',
  'for review': 'For Review',
  completed: 'Completed',
};

const priorityClassMap = {
  high: 'border border-rose-300 bg-rose-100 text-rose-700 dark:border-rose-500/60 dark:bg-rose-500/20 dark:text-rose-200',
  medium: 'border border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-500/60 dark:bg-amber-500/20 dark:text-amber-200',
  low: 'border border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-500/60 dark:bg-emerald-500/20 dark:text-emerald-200',
  default: 'border border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-200',
};

export const formatStatusLabel = (status) => {
  const normalized = normalize(status);

  if (statusLabelMap[normalized]) {
    return statusLabelMap[normalized];
  }

  if (!normalized) {
    return statusLabelMap.pending;
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const resolveStatusCategory = (status) => {
  const normalized = normalize(status);

  if (statusGroups.completed.includes(normalized)) {
    return 'completed';
  }

  if (statusGroups.ongoing.includes(normalized)) {
    return 'ongoing';
  }

  if (statusGroups.critical.includes(normalized)) {
    return 'critical';
  }

  if (statusGroups.review.includes(normalized)) {
    return 'review';
  }

  if (normalized === 'pending') {
    return 'pending';
  }

  return 'default';
};

export const getStatusBadgeClasses = (status) => {
  const category = resolveStatusCategory(status);

  if (category === 'pending') {
    return 'border border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-500/60 dark:bg-amber-500/20 dark:text-amber-200';
  }

  return statusClassMap[category] ?? statusClassMap.default;
};

export const getPriorityBadgeClasses = (priority) => {
  const normalized = normalize(priority);
  return priorityClassMap[normalized] ?? priorityClassMap.default;
};

export const getPriorityLabel = (priority) => {
  const normalized = normalize(priority);

  if (!normalized) {
    return '';
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};
