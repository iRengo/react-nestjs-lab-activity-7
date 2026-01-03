import React from 'react';

const alertStyles = {
  success: 'border-green-200 bg-green-50 text-green-700',
  error: 'border-red-200 bg-red-50 text-red-600',
  info: 'border-slate-200 bg-slate-50 text-slate-600',
};

const FeedbackAlert = ({ feedback }) => {
  if (!feedback?.message) {
    return null;
  }

  const variant = alertStyles[feedback.type] ?? alertStyles.info;

  return (
    <div className={`rounded-md border px-4 py-3 text-sm ${variant}`}>
      {feedback.message}
    </div>
  );
};

export default FeedbackAlert;
