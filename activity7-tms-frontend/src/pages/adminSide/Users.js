import React, { useEffect, useMemo, useState } from 'react';
import { FiFilter, FiSearch } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import { getAllUsers } from '../../services/api/usersApi';

const ROWS_PER_PAGE = 6;

const mapUserRecord = (user) => {
	const firstName = user?.firstName ?? '';
	const lastName = user?.lastName ?? '';
	const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || user?.email || 'Unknown User';
	const initials = [firstName, lastName]
		.filter(Boolean)
		.map((part) => part[0]?.toUpperCase())
		.join('')
		.slice(0, 2) || (user?.email ? user.email.slice(0, 2).toUpperCase() : 'U');
	const normalizedRole = user?.role ?? 'Role unavailable';

	return {
		id: user?.userId ?? user?.id ?? fullName,
		firstName,
		lastName,
		fullName,
		fullNameLower: fullName.toLowerCase(),
		initials,
		role: normalizedRole,
		roleLower: normalizedRole.toLowerCase(),
		email: user?.email ?? '',
	};
};

const Users = () => {
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [roleFilter, setRoleFilter] = useState('all');
	const [userPage, setUserPage] = useState(1);

	useEffect(() => {
		let isMounted = true;

		const fetchUsers = async () => {
			setIsLoading(true);
			setError('');

			try {
				const response = await getAllUsers();
				if (isMounted) {
					setUsers(response);
				}
			} catch (err) {
				if (isMounted) {
					setError(err?.message || 'Failed to load users.');
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		fetchUsers();

		return () => {
			isMounted = false;
		};
	}, []);

	const preparedUsers = useMemo(() => {
		return users.map((user) => mapUserRecord(user));
	}, [users]);

	const roleOptions = useMemo(() => {
		const uniqueRoles = new Set(preparedUsers.map((user) => user.role));
		return Array.from(uniqueRoles).sort((a, b) => a.localeCompare(b));
	}, [preparedUsers]);

	const filteredUsers = useMemo(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase();
		return preparedUsers.filter((user) => {
			const matchesRole = roleFilter === 'all' || user.roleLower === roleFilter;
			if (!matchesRole) {
				return false;
			}

			if (!normalizedSearch) {
				return true;
			}

			return (
				user.fullNameLower.includes(normalizedSearch) ||
				(user.email && user.email.toLowerCase().includes(normalizedSearch))
			);
		});
	}, [preparedUsers, roleFilter, searchTerm]);

	useEffect(() => {
		setUserPage(1);
	}, [searchTerm, roleFilter]);

	const totalUserPages = useMemo(
		() => Math.max(1, Math.ceil(filteredUsers.length / ROWS_PER_PAGE)),
		[filteredUsers.length],
	);

	useEffect(() => {
		if (userPage > totalUserPages) {
			setUserPage(totalUserPages);
		}
	}, [userPage, totalUserPages]);

	const paginatedUsers = useMemo(() => {
		const start = (userPage - 1) * ROWS_PER_PAGE;
		return filteredUsers.slice(start, start + ROWS_PER_PAGE);
	}, [filteredUsers, userPage]);

	return (
		<section className="space-y-6">
			<PageHeader
				title="Users"
				subtitle="Manage team access and visibility across the workspace."
				actions={
					<button
						type="button"
						className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:hover:bg-indigo-500"
					>
						Invite Member
					</button>
				}
			/>

			{error && (
				<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-500/10 dark:text-red-300" role="alert">
					{error}
				</div>
			)}

			<div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-900">
				<label className="flex w-full flex-col gap-1 text-xs font-medium text-slate-500 sm:max-w-xs dark:text-slate-300">
					<span>Search members</span>
					<div className="relative">
							<FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
						<input
							type="search"
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
							placeholder="Type a name or email"
								className="w-full rounded-md border border-slate-200 pl-9 pr-3 py-2 text-sm text-slate-700 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
						/>
					</div>
				</label>
				<label className="flex w-full flex-col gap-1 text-xs font-medium text-slate-500 sm:max-w-[12rem] dark:text-slate-300">
					<span>Filter by role</span>
					<div className="relative">
							<FiFilter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
						<select
							value={roleFilter}
							onChange={(event) => setRoleFilter(event.target.value)}
								className="w-full appearance-none rounded-md border border-slate-200 pl-9 pr-8 py-2 text-sm text-slate-700 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
						>
							<option value="all">All roles</option>
							{roleOptions.map((role) => (
								<option key={role} value={role.toLowerCase()}>
									{role}
								</option>
							))}
						</select>
						<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500">▾</span>
					</div>
				</label>
			</div>

			{isLoading ? (
					<div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
					Loading members...
				</div>
			) : filteredUsers.length === 0 ? (
					<div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
					No users found.
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					{paginatedUsers.map((user) => (
							<div
								key={user.id}
								className="group relative overflow-hidden rounded-xl bg-white p-5 shadow-sm transition hover:shadow-lg dark:bg-slate-900 dark:hover:shadow-slate-950"
							>
								<div className="flex items-center gap-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
										{user.initials}
									</div>
									<div>
										<p className="text-sm font-semibold text-slate-900 dark:text-white">{user.fullName}</p>
										<p className="text-xs text-slate-400 dark:text-slate-300">{user.email || 'No email provided'}</p>
										<p className="text-xs text-slate-500 dark:text-slate-300">{user.role}</p>
									</div>
								</div>
								<div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-3 gap-2 bg-white/95 px-5 pb-4 pt-3 opacity-0 shadow-[0_-6px_12px_-8px_rgba(15,23,42,0.25)] transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 dark:bg-slate-900/95">
									<button
										type="button"
										className="pointer-events-auto flex-1 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-300 dark:focus:ring-indigo-400"
									>
										View
									</button>
									<button
										type="button"
										className="pointer-events-auto flex-1 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-300 dark:focus:ring-indigo-400"
									>
										Edit
									</button>
									<button
										type="button"
										className="pointer-events-auto flex-1 rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10 dark:focus:ring-red-400"
									>
										Delete
									</button>
								</div>
							</div>
					))}
				</div>
			)}

			{!isLoading ? (
				<div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
					<span>Page {userPage} of {totalUserPages}</span>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => setUserPage((previous) => Math.max(previous - 1, 1))}
							disabled={userPage <= 1}
							className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
						>
							Previous
						</button>
						<button
							type="button"
							onClick={() => setUserPage((previous) => Math.min(previous + 1, totalUserPages))}
							disabled={userPage >= totalUserPages}
							className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
						>
							Next
						</button>
					</div>
				</div>
			) : null}
		</section>
	);
};

export default Users;
