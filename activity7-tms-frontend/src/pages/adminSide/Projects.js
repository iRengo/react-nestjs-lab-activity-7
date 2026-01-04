import React from 'react';
import PageHeader from '../../components/common/PageHeader';

const Projects = () => {
	const projects = [
		{
			name: 'Website Relaunch',
			owner: 'Alex Johnson',
			status: 'In Progress',
			dueDate: 'Jan 15, 2026',
		},
		{
			name: 'Mobile App MVP',
			owner: 'Taylor Jenkins',
			status: 'Planning',
			dueDate: 'Feb 4, 2026',
		},
		{
			name: 'Onboarding Revamp',
			owner: 'Priya Patel',
			status: 'Blocked',
			dueDate: 'Jan 29, 2026',
		},
	];

	return (
		<section className="space-y-6">
			<PageHeader
				title="Projects"
				subtitle="Track progress, owners, and deliverables for every initiative."
				actions={
					<button
						type="button"
						className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
					>
						New Project
					</button>
				}
			/>

			<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
				<table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
					<thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
						<tr>
							<th className="px-6 py-3">Project</th>
							<th className="px-6 py-3">Owner</th>
							<th className="px-6 py-3">Status</th>
							<th className="px-6 py-3">Due Date</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 text-sm text-slate-600 dark:divide-slate-800 dark:text-slate-300">
						{projects.map((project) => (
							<tr key={project.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
								<td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{project.name}</td>
								<td className="px-6 py-4">{project.owner}</td>
								<td className="px-6 py-4">
									<span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
										{project.status}
									</span>
								</td>
								<td className="px-6 py-4">{project.dueDate}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
};

export default Projects;
