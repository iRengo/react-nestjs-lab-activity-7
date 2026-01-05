import React, {useCallback, useEffect, useMemo, useState} from 'react';
import PageHeader from '../../components/common/PageHeader';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskModal from '../../components/tasks/TaskModal';
import TasksTable from '../../components/tasks/TasksTable';
import {createTask, deleteTask, getTasks, updateTask} from '../../services/taskService';
import {getAllProjects} from '../../services/projectService';
import {getAllUsers} from '../../services/api/usersApi';

const ROWS_PER_PAGE = 6;

const defaultTaskState = {
	taskTitle: '',
	taskDescription: '',
	assignedTo: '',
	priority: '',
	status: 'pending',
	dueDate: '',
	projectId: '',
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

const Tasks = () => {
	const [tasks, setTasks] = useState([]);
	const [projects, setProjects] = useState([]);
	const [users, setUsers] = useState([]);
	const [taskPage, setTaskPage] = useState(1);
	const [selectedProjectId, setSelectedProjectId] = useState('');
	const [isFetching, setIsFetching] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState(null);
	const [taskForm, setTaskForm] = useState(() => ({...defaultTaskState}));
	const [validationErrors, setValidationErrors] = useState({});
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingTaskId, setEditingTaskId] = useState(null);

	const projectsLookup = useMemo(() => {
		const map = new Map();
		projects.forEach((project) => {
			map.set(project.projectId, project.projectName);
		});
		return map;
	}, [projects]);

	const usersLookup = useMemo(() => {
		const map = new Map();
		users.forEach((user) => {
			map.set(user.userId, `${user.firstName} ${user.lastName}`.trim());
		});
		return map;
	}, [users]);

	const loadProjects = useCallback(async () => {
		try {
			const data = await getAllProjects();
			setProjects(data);
		} catch (error) {
			setErrorMessage(error.message ?? 'Unable to load projects.');
		}
	}, []);

	const loadUsers = useCallback(async () => {
		try {
			const data = await getAllUsers();
			const filtered = Array.isArray(data) ? data.filter((user) => user.role === 'user') : [];
			setUsers(filtered);
		} catch (error) {
			setErrorMessage(error.message ?? 'Unable to load users.');
		}
	}, []);

	const loadTasks = useCallback(async () => {
		setIsFetching(true);
		setErrorMessage('');

		try {
			const data = await getTasks(selectedProjectId ? Number(selectedProjectId) : undefined);
			setTasks(data);
		} catch (error) {
			setErrorMessage(error.message ?? 'Unable to load tasks.');
		} finally {
			setIsFetching(false);
		}
	}, [selectedProjectId]);

	useEffect(() => {
		loadProjects();
		loadUsers();
	}, [loadProjects, loadUsers]);

	useEffect(() => {
		loadTasks();
	}, [loadTasks]);

	useEffect(() => {
		setTaskPage(1);
	}, [selectedProjectId]);

	useEffect(() => {
		if (!successMessage) {
			return undefined;
		}

		const timer = setTimeout(() => setSuccessMessage(''), 4000);
		return () => clearTimeout(timer);
	}, [successMessage]);

	const openCreateModal = () => {
		setTaskForm({...defaultTaskState});
		setValidationErrors({});
		setEditingTaskId(null);
		setIsModalOpen(true);
	};

	const openEditModal = (task) => {
		setTaskForm({
			taskTitle: task.taskTitle ?? '',
			taskDescription: task.taskDescription ?? '',
			assignedTo: task.assignedTo ? String(task.assignedTo) : '',
			priority: task.priority ?? '',
			status: task.status ?? 'pending',
			dueDate: task.dueDate ?? '',
			projectId: task.projectId ? String(task.projectId) : '',
		});
		setValidationErrors({});
		setEditingTaskId(task.taskId);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setTaskForm({...defaultTaskState});
		setValidationErrors({});
		setEditingTaskId(null);
	};

	const handleFormChange = (event) => {
		const {name, value} = event.target;
		setTaskForm((previous) => ({
			...previous,
			[name]: value,
		}));
	};

	const validateTaskPayload = () => {
		const errors = {};

		if (!taskForm.taskTitle.trim()) {
			errors.taskTitle = 'Title is required.';
		}

		if (!taskForm.projectId) {
			errors.projectId = 'Project selection is required.';
		}

		return errors;
	};

	const handleSubmitTask = async (event) => {
		event.preventDefault();

		const validation = validateTaskPayload();

		if (Object.keys(validation).length > 0) {
			setValidationErrors(validation);
			return;
		}

		setIsSubmitting(true);
		setValidationErrors({});
		setErrorMessage('');

		try {
			const payload = {
				taskTitle: taskForm.taskTitle.trim(),
				taskDescription: taskForm.taskDescription.trim() || undefined,
				assignedTo: taskForm.assignedTo ? Number(taskForm.assignedTo) : undefined,
				priority: taskForm.priority || undefined,
				status: taskForm.status || undefined,
				dueDate: taskForm.dueDate || undefined,
				projectId: Number(taskForm.projectId),
			};

			if (editingTaskId) {
				await updateTask(editingTaskId, payload);
				setSuccessMessage('Task updated successfully!');
			} else {
				await createTask(payload);
				setSuccessMessage('Task created successfully!');
			}

			closeModal();
			await loadTasks();
		} catch (error) {
			setErrorMessage(error.message ?? 'Unable to save the task.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteTask = async (taskId) => {
		const confirmation = window.confirm('Are you sure you want to delete this task?');

		if (!confirmation) {
			return;
		}

		setDeletingId(taskId);
		setErrorMessage('');

		try {
			await deleteTask(taskId);
			setSuccessMessage('Task deleted successfully.');
			await loadTasks();
		} catch (error) {
			setErrorMessage(error.message ?? 'Unable to delete the task.');
		} finally {
			setDeletingId(null);
		}
	};

	const handleProjectFilterChange = (value) => {
		setSelectedProjectId(value);
	};

	const totalTaskPages = useMemo(
		() => Math.max(1, Math.ceil(tasks.length / ROWS_PER_PAGE)),
		[tasks.length],
	);

	useEffect(() => {
		if (taskPage > totalTaskPages) {
			setTaskPage(totalTaskPages);
		}
	}, [taskPage, totalTaskPages]);

	const paginatedTasks = useMemo(() => {
		const start = (taskPage - 1) * ROWS_PER_PAGE;
		return tasks.slice(start, start + ROWS_PER_PAGE);
	}, [tasks, taskPage]);

	return (
		<section className="space-y-6">
			<PageHeader
				title="Tasks"
				subtitle="Review the work in motion and clear blockers quickly."
				actions={null}
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

			<TaskFilters
				projects={projects}
				selectedProjectId={selectedProjectId}
				onProjectChange={handleProjectFilterChange}
				onCreateTask={openCreateModal}
			/>

			<TasksTable
				tasks={paginatedTasks}
				isFetching={isFetching}
				projectsLookup={projectsLookup}
				usersLookup={usersLookup}
				formatDate={formatDate}
				deletingId={deletingId}
				page={taskPage}
				totalPages={totalTaskPages}
				onPreviousPage={() => setTaskPage((previous) => Math.max(previous - 1, 1))}
				onNextPage={() => setTaskPage((previous) => Math.min(previous + 1, totalTaskPages))}
				onEditTask={openEditModal}
				onDeleteTask={handleDeleteTask}
			/>

			<TaskModal
				isOpen={isModalOpen}
				mode={editingTaskId ? 'edit' : 'create'}
				formState={taskForm}
				validationErrors={validationErrors}
				isSubmitting={isSubmitting}
				projects={projects}
				users={users}
				onClose={closeModal}
				onChange={handleFormChange}
				onSubmit={handleSubmitTask}
			/>
		</section>
	);
};

export default Tasks;
