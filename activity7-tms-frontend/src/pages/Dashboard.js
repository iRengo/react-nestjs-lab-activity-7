import React from 'react';
import PageHeader from '../components/common/PageHeader';

const Dashboard = () => {
	const headerActions = (
		<button
			type="button"
			className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
		>
			Create Project
		</button>
	);

	return (
		<section className="space-y-6">
			<PageHeader
				title="Dashboard"
				subtitle="Monitor key metrics and stay ahead of your team’s workload."
				actions={headerActions}
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="rounded-xl bg-white p-6 shadow-sm">
					<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Active Projects</p>
					<p className="mt-3 text-3xl font-semibold text-slate-900">12</p>
					<p className="mt-1 text-sm text-slate-500">4 launching this week</p>
				</div>
				<div className="rounded-xl bg-white p-6 shadow-sm">
					<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tasks Due Today</p>
					<p className="mt-3 text-3xl font-semibold text-slate-900">27</p>
					<p className="mt-1 text-sm text-slate-500">Keep the momentum going</p>
				</div>
				<div className="rounded-xl bg-white p-6 shadow-sm">
					<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Team Capacity</p>
					<p className="mt-3 text-3xl font-semibold text-slate-900">83%</p>
					<p className="mt-1 text-sm text-slate-500">Room to take on 8 more tasks</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<div className="rounded-xl bg-white p-6 shadow-sm">
					<h3 className="text-lg font-semibold text-slate-900">Upcoming Deadlines</h3>
					<ul className="mt-4 space-y-3">
						{[
							{ name: 'Website Launch', date: 'Jan 4' },
							{ name: 'Design Review', date: 'Jan 6' },
							{ name: 'Client Demo', date: 'Jan 8' },
						].map((item) => (
							<li key={item.name} className="flex items-center justify-between text-sm text-slate-600">
								<span>{item.name}</span>
								<span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
									{item.date}
								</span>
							</li>
						))}
					</ul>
				</div>
				<div className="rounded-xl bg-white p-6 shadow-sm">
					<h3 className="text-lg font-semibold text-slate-900">Team Activity</h3>
					<ul className="mt-4 space-y-3 text-sm text-slate-600">
						<li>
							<span className="font-medium text-slate-900">Taylor</span> closed 4 tasks in Marketing Sprint
						</li>
						<li>
							<span className="font-medium text-slate-900">Jordan</span> created 2 new user stories
						</li>
						<li>
							<span className="font-medium text-slate-900">Priya</span> added a post-launch QA checklist
						</li>
					</ul>
				</div>
			</div>
		</section>
	);
};

export default Dashboard;
