import React from 'react';
import PageHeader from '../../components/common/PageHeader';

const Users = () => {
	const users = [
		{ name: 'Alex Johnson', role: 'Product Manager', location: 'Austin, TX' },
		{ name: 'Priya Patel', role: 'Quality Lead', location: 'Denver, CO' },
		{ name: 'Jordan Lee', role: 'Design Lead', location: 'Remote' },
		{ name: 'Taylor Jenkins', role: 'Engineering Manager', location: 'Chicago, IL' },
	];

	return (
		<section className="space-y-6">
			<PageHeader
				title="Users"
				subtitle="Manage team access and visibility across the workspace."
				actions={
					<button
						type="button"
						className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
					>
						Invite Member
					</button>
				}
			/>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				{users.map((user) => (
					<div key={user.name} className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
								{user.name
									.split(' ')
									.map((part) => part[0])
									.join('')}
							</div>
							<div>
								<p className="text-sm font-semibold text-slate-900">{user.name}</p>
								<p className="text-xs text-slate-500">{user.role}</p>
								<p className="text-xs text-slate-400">{user.location}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default Users;
