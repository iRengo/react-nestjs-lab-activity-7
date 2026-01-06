import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Chart as ChartJS, ArcElement, Legend, Tooltip} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';
import PageHeader from '../../components/common/PageHeader';
import {getAllProjects} from '../../services/projectService';
import {getTasks} from '../../services/taskService';
import {getAllUsers} from '../../services/api/usersApi';

ChartJS.register(ArcElement, Tooltip, Legend);

const parseDateOnly = (value) => {
	if (!value) {
		return null;
	}

	if (value instanceof Date && !Number.isNaN(value.getTime())) {
		return new Date(value.getFullYear(), value.getMonth(), value.getDate());
	}

	if (typeof value === 'string') {
		const segments = value.split('-');

		if (segments.length >= 3) {
			const year = Number(segments[0]);
			const month = Number(segments[1]);
			const day = Number(segments[2]);

			if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
				return new Date(year, month - 1, day);
			}
		}
	}

	const parsed = new Date(value);

	if (Number.isNaN(parsed.getTime())) {
		return null;
	}

	return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const toDateKey = (date) => {
	if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
		return '';
	}

	const year = String(date.getFullYear());
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const formatShortDate = (date) => {
	if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
		return '--';
	}

	return date.toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
};

const formatTimeAgo = (value) => {
	const date = value instanceof Date ? value : new Date(value);

	if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
		return '';
	}

	const diffMs = Date.now() - date.getTime();

	if (diffMs < 0) {
		return 'just now';
	}

	const minutes = Math.round(diffMs / 60000);

	if (minutes < 1) {
		return 'just now';
	}

	if (minutes < 60) {
		return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
	}

	const hours = Math.round(minutes / 60);

	if (hours < 24) {
		return `${hours} hour${hours === 1 ? '' : 's'} ago`;
	}

	const days = Math.round(hours / 24);

	if (days < 7) {
		return `${days} day${days === 1 ? '' : 's'} ago`;
	}

	return date.toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
};

const formatUserName = (user) => {
	if (!user) {
		return 'Unassigned';
	}

	const first = user.firstName ?? '';
	const last = user.lastName ?? '';
	const full = `${first} ${last}`.trim();
	return full || user.email || 'Unassigned';
};

const Dashboard = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [projects, setProjects] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		let isMounted = true;

		const loadDashboard = async () => {
			setIsLoading(true);
			setError('');

			try {
				const [projectsData, tasksData, usersData] = await Promise.all([
					getAllProjects(),
					getTasks(),
					getAllUsers({role: 'user'}),
				]);

				if (!isMounted) {
					return;
				}

				setProjects(projectsData);
				setTasks(tasksData);
				setUsers(usersData);
			} catch (err) {
				if (!isMounted) {
					return;
				}

				setError(err?.message || 'Unable to load dashboard data.');
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		loadDashboard();

		return () => {
			isMounted = false;
		};
	}, []);

	const activeProjectsCount = useMemo(() => {
		return projects.filter((project) => (project.status ?? '').toLowerCase() !== 'completed').length;
	}, [projects]);

	const completedProjectsCount = useMemo(() => {
		return projects.filter((project) => (project.status ?? '').toLowerCase() === 'completed').length;
	}, [projects]);

	const todayTasksCount = useMemo(() => {
		const todayKey = toDateKey(new Date());

		return tasks.reduce((count, task) => {
			const parsed = parseDateOnly(task.dueDate);
			return toDateKey(parsed) === todayKey ? count + 1 : count;
		}, 0);
	}, [tasks]);

	const openTasksCount = useMemo(() => {
		return tasks.filter((task) => (task.status ?? '').toLowerCase() !== 'completed').length;
	}, [tasks]);

	const completedTasksCount = useMemo(() => {
		return tasks.filter((task) => (task.status ?? '').toLowerCase() === 'completed').length;
	}, [tasks]);

	const overdueCounts = useMemo(() => {
		const now = new Date();
		now.setHours(0, 0, 0, 0);

		const overdueProjects = projects.filter((project) => {
			if (!project.endDate) {
				return false;
			}

			const endDate = parseDateOnly(project.endDate);
			if (!endDate) {
				return false;
			}

			const status = (project.status ?? '').toLowerCase();
			return endDate.getTime() < now.getTime() && status !== 'completed';
		});

		const overdueTasks = tasks.filter((task) => {
			if (!task.dueDate) {
				return false;
			}

			const due = parseDateOnly(task.dueDate);
			if (!due) {
				return false;
			}

			const status = (task.status ?? '').toLowerCase();
			return due.getTime() < now.getTime() && status !== 'completed';
		});

		return {
			projects: overdueProjects.length,
			tasks: overdueTasks.length,
		};
	}, [projects, tasks]);

	const overdueProjectsCount = overdueCounts.projects;
	const overdueTasksCount = overdueCounts.tasks;
	const overdueWorkTotal = overdueProjectsCount + overdueTasksCount;

	const metricCards = useMemo(
		() => [
			{
				id: 'active-projects',
				title: 'Active Projects',
				value: isLoading ? '--' : activeProjectsCount,
				description: isLoading ? 'Loading project summary...' : `${projects.length} total projects`,
			},
			{
				id: 'completed-projects',
				title: 'Completed Projects',
				value: isLoading ? '--' : completedProjectsCount,
				description: isLoading ? 'Calculating completed work...' : `${completedProjectsCount} finished projects`,
			},
			{
				id: 'tasks-due',
				title: 'Tasks Due Today',
				value: isLoading ? '--' : todayTasksCount,
				description: isLoading ? 'Tracking upcoming deadlines...' : `${openTasksCount} tasks open overall`,
			},
		],
		[isLoading, activeProjectsCount, projects.length, completedProjectsCount, todayTasksCount, openTasksCount],
	);

	const donutData = useMemo(() => {
		return {
			labels: ['Completed Tasks', 'Overdue Work', 'Completed Projects'],
			datasets: [
				{
					label: 'Work Overview',
					data: [completedTasksCount, overdueWorkTotal, completedProjectsCount],
					backgroundColor: ['#4f46e5', '#f97316', '#10b981'],
					hoverBackgroundColor: ['#4338ca', '#ea580c', '#059669'],
					borderWidth: 0,
				},
			],
		};
	}, [completedTasksCount, overdueWorkTotal, completedProjectsCount]);

	const donutOptions = useMemo(
		() => ({
			plugins: {
				legend: {
					position: 'bottom',
					labels: {
						usePointStyle: true,
						pointStyle: 'circle',
						padding: 20,
					},
				},
				tooltip: {
					callbacks: {
						label: (context) => {
							const label = context.label ?? '';
							const raw = Number(context.parsed ?? 0);
							const total = context.dataset?.data?.reduce((sum, value) => sum + Number(value || 0), 0) ?? 0;
							const percent = total > 0 ? Math.round((raw / total) * 100) : 0;
							return `${label}: ${raw} (${percent}%)`;
						},
					},
				},
			},
			cutout: '55%',
			responsive: true,
			maintainAspectRatio: false,
		}),
		[],
	);

	const donutHasData = completedTasksCount > 0 || completedProjectsCount > 0 || overdueWorkTotal > 0;

	const upcomingDeadlines = useMemo(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		return tasks
			.map((task) => ({
				task,
				date: parseDateOnly(task.dueDate),
			}))
			.filter(({date}) => date && date.getTime() >= today.getTime())
			.sort((a, b) => a.date.getTime() - b.date.getTime())
			.slice(0, 5)
			.map(({task, date}) => ({
				id: task.taskId,
				name: task.taskTitle || `Task #${task.taskId}`,
				projectName: task.project?.projectName || '',
				dateLabel: formatShortDate(date),
			}));
	}, [tasks]);

	const activityItems = useMemo(() => {
		return tasks
			.filter((task) => task.updatedAt)
			.slice()
			.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
			.slice(0, 5)
			.map((task) => {
				const assignedUser = users.find((user) => user.userId === task.assignedTo);
				const actor = formatUserName(assignedUser);
				const status = (task.status ?? '').toLowerCase();
				let action = 'updated';

				if (status === 'completed') {
					action = 'completed';
				} else if (status) {
					action = `moved to ${status.replace(/_/g, ' ')}`;
				}

				return {
					id: task.taskId,
					actor,
					action,
					taskTitle: task.taskTitle || `Task #${task.taskId}`,
					timestamp: task.updatedAt,
				};
			});
	}, [tasks, users]);

	const headerActions = (
		<button
			type="button"
			onClick={() => navigate('/adminSide/projects')}
			className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
		>
			Create Project
		</button>
	);

	return (
		<section className="space-y-6">
			<PageHeader
				title="Dashboard"
				subtitle="Monitor key metrics and stay ahead of your team."
				actions={headerActions}
			/>

			{error ? (
				<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200">
					{error}
				</div>
			) : null}

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				{metricCards.map((card) => (
					<div key={card.id} className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900 dark:text-slate-200">
						<p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-400">{card.title}</p>
						<p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{card.value}</p>
						<p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{card.description}</p>
					</div>
				))}
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
					<h3 className="text-lg font-semibold text-slate-900 dark:text-white">Work Summary</h3>
					{isLoading ? (
						<p className="mt-4 text-sm text-slate-500 dark:text-slate-300">Loading chart...</p>
					) : donutHasData ? (
						<>
							<div className="relative mx-auto mt-4 h-60 w-full max-w-xs">
								<Doughnut data={donutData} options={donutOptions} />
							</div>
							<dl className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
								<div className="flex justify-between">
									<dt>Completed tasks</dt>
									<dd className="font-semibold text-slate-900 dark:text-white">{completedTasksCount}</dd>
								</div>
								<div className="flex justify-between">
									<dt>Completed projects</dt>
									<dd className="font-semibold text-slate-900 dark:text-white">{completedProjectsCount}</dd>
								</div>
								<div className="flex justify-between">
									<dt>Overdue work</dt>
									<dd className="font-semibold text-slate-900 dark:text-white">{overdueWorkTotal}</dd>
								</div>
							</dl>
							<p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Overdue breakdown: {overdueProjectsCount} projects, {overdueTasksCount} tasks.</p>
						</>
					) : (
						<p className="mt-4 text-sm text-slate-500 dark:text-slate-300">No completed or overdue work recorded yet.</p>
					)}
				</div>
				<div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
					<h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Deadlines</h3>
					{isLoading ? (
						<p className="mt-4 text-sm text-slate-500 dark:text-slate-300">Loading deadlines...</p>
					) : upcomingDeadlines.length === 0 ? (
						<p className="mt-4 text-sm text-slate-500 dark:text-slate-300">No upcoming tasks with due dates.</p>
					) : (
						<ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
							{upcomingDeadlines.map((item) => (
								<li key={item.id} className="flex items-center justify-between gap-3 overflow-hidden text-sm text-slate-600 dark:text-slate-300">
									<span className="flex-1 truncate">
										{item.name}
										{item.projectName ? <span className="text-slate-400 dark:text-slate-500"> - {item.projectName}</span> : null}
									</span>
									<span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
										{item.dateLabel}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>
				<div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
					<h3 className="text-lg font-semibold text-slate-900 dark:text-white">Team Activity</h3>
					{isLoading ? (
						<p className="mt-4 text-sm text-slate-500 dark:text-slate-300">Loading recent updates...</p>
					) : activityItems.length === 0 ? (
						<p className="mt-4 text-sm text-slate-500 dark:text-slate-300">No recent task updates recorded.</p>
					) : (
						<ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1 text-sm text-slate-600 dark:text-slate-300">
							{activityItems.map((item) => (
								<li key={item.id} className="flex flex-col gap-1 overflow-hidden">
									<span className="truncate">
										<span className="font-medium text-slate-900 dark:text-white">{item.actor}</span> {item.action} <span className="font-medium text-slate-900 dark:text-white">{item.taskTitle}</span>
									</span>
									<span className="text-xs text-slate-400 dark:text-slate-500">{formatTimeAgo(item.timestamp)}</span>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</section>
	);
};

export default Dashboard;
