import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import {createProject, deleteProject, getAllProjects, updateProject} from '../../services/projectService';
import ProjectsTable from '../../components/projects/ProjectsTable';
import CreateProjectModal from '../../components/projects/CreateProjectModal';
import ProjectDetailsModal from '../../components/projects/ProjectDetailsModal';
import {getTasks} from '../../services/taskService';

const ROWS_PER_PAGE = 6;

const defaultFormState = {
	projectName: '',
	projectDescription: '',
	startDate: '',
	endDate: '',
	status: 'pending',
};

const statusLabels = {
	pending: 'Pending',
	ongoing: 'Ongoing',
	completed: 'Completed',
};

const isTaskStatusCompleted = (status) => {
	const normalized = (status ?? '').toString().toLowerCase();
	return ['completed', 'complete', 'done'].includes(normalized);
};

const formatDate = (value) => {
	if (!value) {
		return '—';
	}

	const parsed = new Date(value);

	if (Number.isNaN(parsed.getTime())) {
		return value;
	}

	return parsed.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

const Projects = () => {
	const navigate = useNavigate();
	const [projects, setProjects] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [projectPage, setProjectPage] = useState(1);
	const [isFetching, setIsFetching] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState(null);
	const [markingProjectId, setMarkingProjectId] = useState(null);
	const [formState, setFormState] = useState(() => ({...defaultFormState}));
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [editingProjectId, setEditingProjectId] = useState(null);
	const [selectedProject, setSelectedProject] = useState(null);

	const loadProjects = useCallback(async () => {
		setIsFetching(true);
		setErrorMessage('');

		try {
			const data = await getAllProjects();
			setProjects(data);
		} catch (error) {
			setErrorMessage(error.message ?? 'Unable to load projects.');
		} finally {
			setIsFetching(false);
		}
	}, []);

	const loadTasks = useCallback(async () => {
		try {
			const data = await getTasks();
			setTasks(Array.isArray(data) ? data : []);
		} catch (error) {
			setErrorMessage((previous) => previous || error.message || 'Unable to load tasks for progress.');
		}
	}, []);

	useEffect(() => {
		loadProjects();
		loadTasks();
	}, [loadProjects, loadTasks]);

	useEffect(() => {
		if (!successMessage) {
			return undefined;
		}

		const timer = setTimeout(() => setSuccessMessage(''), 4000);
		return () => clearTimeout(timer);
	}, [successMessage]);

	const orderedProjects = useMemo(
		() => projects.slice().sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0)),
		[projects],
	);

	const totalProjectPages = useMemo(
		() => Math.max(1, Math.ceil(orderedProjects.length / ROWS_PER_PAGE)),
		[orderedProjects.length],
	);

	useEffect(() => {
		if (projectPage > totalProjectPages) {
			setProjectPage(totalProjectPages);
		}
	}, [projectPage, totalProjectPages]);

	const paginatedProjects = useMemo(() => {
		const start = (projectPage - 1) * ROWS_PER_PAGE;
		return orderedProjects.slice(start, start + ROWS_PER_PAGE);
	}, [orderedProjects, projectPage]);

	const projectProgress = useMemo(() => {
		const progress = new Map();
		if (!tasks.length) {
			return progress;
		}

		const aggregation = tasks.reduce((accumulator, task) => {
			const key = task.projectId;
			if (!accumulator[key]) {
				accumulator[key] = {total: 0, completed: 0};
			}

			accumulator[key].total += 1;

			const normalizedStatus = (task.status ?? '').toString().toLowerCase();
			if (['completed', 'complete', 'done'].includes(normalizedStatus)) {
				accumulator[key].completed += 1;
			}

			return accumulator;
		}, {});

		const colorByStep = {
			0: 'bg-slate-300 dark:bg-slate-700',
			25: 'bg-rose-400',
			50: 'bg-amber-400',
			75: 'bg-sky-400',
			100: 'bg-emerald-500',
		};

		Object.entries(aggregation).forEach(([projectId, stats]) => {
			const rawPercentage = stats.total === 0 ? 0 : (stats.completed / stats.total) * 100;
			const steps = [0, 25, 50, 75, 100];
			const nearestStep = steps.reduce((previous, current) =>
				Math.abs(current - rawPercentage) < Math.abs(previous - rawPercentage) ? current : previous,
			0);

			progress.set(Number(projectId), {
				raw: Math.round(rawPercentage),
				step: nearestStep,
				colorClass: colorByStep[nearestStep] ?? colorByStep[0],
				total: stats.total,
				completed: stats.completed,
			});
		});

		return progress;
	}, [tasks]);

	const resolveCreatorName = useCallback((project) => {
		const firstName = project?.createdByUser?.firstName ?? '';
		const lastName = project?.createdByUser?.lastName ?? '';
		const fullName = `${firstName} ${lastName}`.trim();

		if (fullName) {
			return fullName;
		}

		if (project?.createdBy) {
			return `User #${project.createdBy}`;
		}

		return '—';
	}, []);

	const openCreateModal = () => {
		setFormState({...defaultFormState});
		setEditingProjectId(null);
		setIsCreateModalOpen(true);
	};

	const openEditModal = (project) => {
		setFormState({
			projectName: project.projectName ?? '',
			projectDescription: project.projectDescription ?? '',
			startDate: project.startDate ?? '',
			endDate: project.endDate ?? '',
			status: project.status ?? 'pending',
		});
		setEditingProjectId(project.projectId);
		setIsCreateModalOpen(true);
	};

	const closeCreateModal = () => {
		setIsCreateModalOpen(false);
		setEditingProjectId(null);
		setFormState({...defaultFormState});
	};

	const handleFormChange = (event) => {
		const {name, value} = event.target;
		setFormState((previous) => ({
			...previous,
			[name]: value,
		}));
	};

	const handleCreateOrUpdateProject = async (event) => {
		event.preventDefault();

		if (formState.startDate && formState.endDate && formState.startDate > formState.endDate) {
			setErrorMessage('End date must be after the start date.');
			return;
		}

		setIsSubmitting(true);
		setErrorMessage('');

		try {
			const payload = {
				projectName: formState.projectName.trim(),
				projectDescription: formState.projectDescription.trim() || undefined,
				startDate: formState.startDate || undefined,
				endDate: formState.endDate || undefined,
				status: formState.status,
			};

			if (editingProjectId) {
				await updateProject(editingProjectId, payload);
				setSuccessMessage('Project updated successfully!');
			} else {
				await createProject(payload);
				setSuccessMessage('Project created successfully!');
			}
			closeCreateModal();
			await loadProjects();
		} catch (error) {
			setErrorMessage(error.message ?? 'Unable to save the project.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteProject = async (projectId) => {
		const confirmation = window.confirm('Are you sure you want to delete this project?');

		if (!confirmation) {
			return;
		}

		setDeletingId(projectId);
		setErrorMessage('');

		try {
			await deleteProject(projectId);
			setSuccessMessage('Project deleted successfully.');
			await loadProjects();
		} catch (error) {
			setErrorMessage(error.message ?? 'Unable to delete the project.');
		} finally {
			setDeletingId(null);
		}
	};

	const handleMarkProjectCompleted = async (project) => {
		if (markingProjectId) {
			return;
		}

		const normalizedStatus = (project.status ?? '').toString().toLowerCase();
		if (normalizedStatus === 'completed') {
			setSuccessMessage('');
			setErrorMessage('This project is already marked as completed.');
			return;
		}

		const relatedTasks = tasks.filter((task) => task.projectId === project.projectId);
		const hasIncompleteTask = relatedTasks.some((task) => !isTaskStatusCompleted(task.status));

		if (hasIncompleteTask) {
			setSuccessMessage('');
			setErrorMessage('Complete all tasks for this project before marking it as completed.');
			return;
		}

		setMarkingProjectId(project.projectId);
		setErrorMessage('');

		try {
			await updateProject(project.projectId, {status: 'completed'});
			setSuccessMessage('Project marked as completed.');
			await loadProjects();
		} catch (error) {
			setErrorMessage(error.message ?? 'Unable to mark the project as completed.');
		} finally {
			setMarkingProjectId(null);
		}
	};

	const handleViewProject = (project) => {
		setSelectedProject(project);
	};

	const closeViewModal = () => {
		setSelectedProject(null);
	};

	const handleNavigateToTasks = (projectId) => {
		navigate('/adminSide/tasks', {state: {projectId}});
	};

	return (
		<section className="space-y-6">
			<PageHeader
				title="Projects"
				subtitle="Track progress, owners, and deliverables for every initiative."
				actions={(
					<button
						type="button"
						onClick={openCreateModal}
						className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:hover:bg-indigo-500"
					>
						New Project
					</button>
				)}
			/>

			{errorMessage ? (
				<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/60 dark:text-red-200">
					{errorMessage}
				</div>
			) : null}

			{successMessage ? (
				<div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
					{successMessage}
				</div>
			) : null}

			<ProjectsTable
				projects={paginatedProjects}
				isFetching={isFetching}
				statusLabels={statusLabels}
				formatDate={formatDate}
				resolveCreatorName={resolveCreatorName}
				projectProgress={projectProgress}
				page={projectPage}
				totalPages={totalProjectPages}
				onNextPage={() => setProjectPage((previous) => Math.min(previous + 1, totalProjectPages))}
				onPreviousPage={() => setProjectPage((previous) => Math.max(previous - 1, 1))}
				deletingId={deletingId}
				onEditProject={openEditModal}
				onViewProject={handleViewProject}
				onNavigateToTasks={handleNavigateToTasks}
				onDeleteProject={handleDeleteProject}
				onMarkProjectComplete={handleMarkProjectCompleted}
				markingProjectId={markingProjectId}
			/>

			<CreateProjectModal
				isOpen={isCreateModalOpen}
				formState={formState}
				statusLabels={statusLabels}
				isSubmitting={isSubmitting}
				onClose={closeCreateModal}
				onChange={handleFormChange}
				onSubmit={handleCreateOrUpdateProject}
				mode={editingProjectId ? 'edit' : 'create'}
			/>

			<ProjectDetailsModal
				project={selectedProject}
				statusLabels={statusLabels}
				formatDate={formatDate}
				resolveCreatorName={resolveCreatorName}
				onClose={closeViewModal}
			/>
		</section>
	);
};

export default Projects;
