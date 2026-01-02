import React from 'react';
import PageHeader from '../components/common/PageHeader';

const Tasks = () => {
	const tasks = [
		{
			title: 'Finalize sprint scope',
			assignee: 'Jordan Lee',
			status: 'In Review',
		},
		{
			title: 'Draft onboarding copy',
			assignee: 'Alex Johnson',
			status: 'In Progress',
		},
		{
			title: 'QA regression suite',
			assignee: 'Priya Patel',
			status: 'Blocked',
		},
		{
			title: 'Budget update for Q1',
			assignee: 'Taylor Jenkins',
			status: 'Done',
		},
	];

	return (
		<section className="space-y-6">
			<PageHeader
				title="Tasks"
				subtitle="Review the work in motion and clear blockers quickly."
				actions={
					<div className="flex gap-2">
						<button
							type="button"
							className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
						>
							Filter
						</button>
						<button
							type="button"
							className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
						>
							New Task
						</button>
					</div>
				}
			/>

			<div className="space-y-3">
				{tasks.map((task) => (
					<div
						key={task.title}
						className="flex items-center justify-between rounded-xl bg-white px-5 py-4 shadow-sm transition hover:shadow-md"
					>
						<div>
							<p className="text-sm font-semibold text-slate-900">{task.title}</p>
							<p className="text-xs text-slate-500">Assigned to {task.assignee}</p>
						</div>
						<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
							{task.status}
						</span>
					</div>
				))}
			</div>
		</section>
	);
};

export default Tasks;
