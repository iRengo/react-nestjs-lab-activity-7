import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { deleteUser, getAllUsers, updateUser } from '../../services/api/usersApi';

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
	const normalizedStatus = user?.status ?? 'Status unavailable';

	return {
		id: user?.userId ?? user?.id ?? fullName,
		firstName,
		lastName,
		fullName,
		fullNameLower: fullName.toLowerCase(),
		initials,
		role: normalizedRole,
		email: user?.email ?? '',
		status: normalizedStatus,
		raw: user,
	};
};

const Users = () => {
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [userPage, setUserPage] = useState(1);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [formState, setFormState] = useState({firstName: '', lastName: '', email: '', status: 'active'});
	const [isSaving, setIsSaving] = useState(false);
	const [modalError, setModalError] = useState('');
	const [isDeletingId, setIsDeletingId] = useState(null);
	const [successMessage, setSuccessMessage] = useState('');

	const loadUsers = useCallback(async () => {
		setIsLoading(true);
		setError('');
		try {
			const response = await getAllUsers({role: 'user'});
			setUsers(response);
		} catch (err) {
			setError(err?.message || 'Failed to load users.');
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadUsers();
	}, [loadUsers]);

	useEffect(() => {
		if (!successMessage) {
			return undefined;
		}

		const timer = setTimeout(() => setSuccessMessage(''), 4000);
		return () => clearTimeout(timer);
	}, [successMessage]);

	const preparedUsers = useMemo(() => {
		return users.map((user) => mapUserRecord(user));
	}, [users]);

	const statusOptions = useMemo(() => {
		const uniqueStatuses = new Set(
			users
				.map((user) => (user?.status ?? '').trim())
				.filter((status) => status.length > 0),
		);

		if (uniqueStatuses.size === 0) {
			uniqueStatuses.add('active');
		}

		return Array.from(uniqueStatuses).sort((a, b) => a.localeCompare(b));
	}, [users]);

	const filteredUsers = useMemo(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase();
		return preparedUsers.filter((user) => {
			if (!normalizedSearch) {
				return true;
			}

			return (
				user.fullNameLower.includes(normalizedSearch) ||
				(user.email && user.email.toLowerCase().includes(normalizedSearch))
			);
		});
	}, [preparedUsers, searchTerm]);

	useEffect(() => {
		setUserPage(1);
	}, [searchTerm]);

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

	const openEditModal = (userRecord) => {
		const rawUser = userRecord?.raw ?? users.find((item) => item.userId === userRecord?.id);

		if (!rawUser) {
			return;
		}

		setEditingUser(rawUser);
		setFormState({
			firstName: rawUser.firstName ?? '',
			lastName: rawUser.lastName ?? '',
			email: rawUser.email ?? '',
			status: rawUser.status ?? 'active',
		});
		setIsSaving(false);
		setModalError('');
		setIsEditModalOpen(true);
	};

	const closeEditModal = () => {
		setIsEditModalOpen(false);
		setEditingUser(null);
		setFormState({firstName: '', lastName: '', email: '', status: 'active'});
		setIsSaving(false);
		setModalError('');
	};

	const handleFormChange = (event) => {
		const {name, value} = event.target;
		setFormState((previous) => ({
			...previous,
			[name]: value,
		}));
		setModalError('');
	};

	const handleSubmitEdit = async (event) => {
		event.preventDefault();

		if (!editingUser) {
			return;
		}

		setIsSaving(true);
		setModalError('');
		setSuccessMessage('');

		try {
			const payload = {
				firstName: formState.firstName.trim(),
				lastName: formState.lastName.trim(),
				email: formState.email.trim(),
				status: formState.status,
			};

			await updateUser(editingUser.userId, payload);
			setSuccessMessage('User details updated successfully.');
			closeEditModal();
			await loadUsers();
		} catch (err) {
			setModalError(err?.message || 'Unable to update user.');
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeleteUser = async (userRecord) => {
		const rawUser = userRecord?.raw ?? users.find((item) => item.userId === userRecord?.id);

		if (!rawUser) {
			return;
		}

		const displayName = [rawUser.firstName, rawUser.lastName].filter(Boolean).join(' ').trim() || rawUser.email || 'this user';
		const confirmation = window.confirm(`Delete ${displayName}? Assigned incomplete tasks will become unassigned.`);
		if (!confirmation) {
			return;
		}

		setIsDeletingId(rawUser.userId);
		setError('');
		setSuccessMessage('');

		try {
			await deleteUser(rawUser.userId);
			setSuccessMessage('User deleted successfully.');
			await loadUsers();
		} catch (err) {
			setError(err?.message || 'Failed to delete user.');
		} finally {
			setIsDeletingId(null);
		}
	};

	const handleViewTasks = (userRecord) => {
		const rawUser = userRecord?.raw ?? users.find((item) => item.userId === userRecord?.id);

		if (!rawUser?.userId) {
			return;
		}

		navigate('/adminSide/tasks', {
			state: {assigneeId: rawUser.userId},
		});
	};

	return (
		<>
			<section className="space-y-6">
			<PageHeader
				title="Users"
				subtitle="Manage team access and visibility across the workspace."
				
			/>

			{error && (
				<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-500/10 dark:text-red-300" role="alert">
					{error}
				</div>
			)}

			{successMessage && (
				<div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-300" role="status">
					{successMessage}
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
										<p className="text-xs text-slate-500 dark:text-slate-300">Status: {user.status}</p>
									</div>
								</div>
								<div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-3 gap-2 bg-white/95 px-5 pb-4 pt-3 opacity-0 shadow-[0_-6px_12px_-8px_rgba(15,23,42,0.25)] transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 dark:bg-slate-900/95">
									<button
										type="button"
										onClick={() => handleViewTasks(user)}
										className="pointer-events-auto flex-1 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-300 dark:focus:ring-indigo-400"
									>
										Tasks
									</button>
									<button
										type="button"
										onClick={() => openEditModal(user)}
										className="pointer-events-auto flex-1 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-300 dark:focus:ring-indigo-400"
									>
										Edit
									</button>
									<button
										type="button"
										onClick={() => handleDeleteUser(user)}
										disabled={isDeletingId === user.id}
										className="pointer-events-auto flex-1 rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10 dark:focus:ring-red-400"
									>
										{isDeletingId === user.id ? 'Deleting…' : 'Delete'}
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

			{isEditModalOpen && editingUser ? (
				<EditUserModal
					user={editingUser}
					formState={formState}
					onChange={handleFormChange}
					onClose={closeEditModal}
					onSubmit={handleSubmitEdit}
					isSaving={isSaving}
					statusOptions={statusOptions}
					error={modalError}
				/>
			) : null}
		</>
	);
};

const EditUserModal = ({user, formState, onChange, onClose, onSubmit, isSaving, statusOptions, error}) => {
	const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || user?.email || 'User';

	return (
	<div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4">
		<div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
			<header className="mb-4 flex items-start justify-between">
				<div>
					<h2 className="text-lg font-semibold text-slate-900 dark:text-white">Edit {displayName}</h2>
					<p className="text-xs text-slate-500 dark:text-slate-300">Update profile details and availability status.</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="rounded-md border border-transparent p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
				>
					<span className="sr-only">Close</span>
					×
				</button>
			</header>
			<form onSubmit={onSubmit} className="space-y-4">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-300">
						<span>First name</span>
						<input
							type="text"
							name="firstName"
							value={formState.firstName}
							onChange={onChange}
							className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
						/>
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-300">
						<span>Last name</span>
						<input
							type="text"
							name="lastName"
							value={formState.lastName}
							onChange={onChange}
							className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
						/>
					</label>
				</div>
				<label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-300">
					<span>Email</span>
					<input
						type="email"
						name="email"
						value={formState.email}
						onChange={onChange}
						required
						className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
					/>
				</label>
				<label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-300">
					<span>Status</span>
					<select
						name="status"
						value={formState.status}
						onChange={onChange}
						className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
					>
						{statusOptions.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</select>
				</label>

				{error && (
					<p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-500/10 dark:text-red-300">{error}</p>
				)}

				<footer className="flex justify-end gap-2 pt-2">
					<button
						type="button"
						onClick={onClose}
						className="rounded-md border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-indigo-400"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSaving}
						className="rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-indigo-300"
					>
						{isSaving ? 'Saving…' : 'Save changes'}
					</button>
				</footer>
			</form>
		</div>
	</div>
);
};

export default Users;
