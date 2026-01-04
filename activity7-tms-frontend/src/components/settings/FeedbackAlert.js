import React from 'react';

const alertStyles = {
  success: 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-500/10 dark:text-green-300',
  error: 'border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-500/10 dark:text-red-300',
  info: 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
};

const FeedbackAlert = ({ feedback }) => {
  if (!feedback?.message) {
    return null;
  }

  const variant = alertStyles[feedback.type] ?? alertStyles.info;

  return (
    <div className={`rounded-md border px-4 py-3 text-sm transition-colors ${variant}`}>
      {feedback.message}
    </div>
  );
};

export default FeedbackAlert;
