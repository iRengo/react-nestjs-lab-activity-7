import React from 'react';
import PageHeader from '../../components/common/PageHeader';

const mockTasks = [
  { id: 101, name: 'Draft project brief', status: 'In Progress', dueDate: 'Apr 14' },
  { id: 102, name: 'Sync with QA team', status: 'Not Started', dueDate: 'Apr 15' },
  { id: 103, name: 'Submit budget update', status: 'Completed', dueDate: 'Apr 10' },
];

const statusColorMap = {
  'Not Started': 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-indigo-100 text-indigo-700',
  Completed: 'bg-emerald-100 text-emerald-700',
};

const Tasks = () => {
  return (
    <section className="space-y-6">
      <PageHeader
        title="My Tasks"
        subtitle="Monitor progress and upcoming deadlines."
      />

      <div className="space-y-3">
        {mockTasks.map((task) => (
          <div key={task.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">{task.name}</p>
              <p className="text-xs text-slate-500">Due {task.dueDate}</p>
            </div>
            <span className={`inline-flex min-w-[8rem] justify-center rounded-full px-3 py-1 text-xs font-medium ${statusColorMap[task.status]}`}>
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Tasks;
