import {useCallback, useEffect, useRef, useState} from 'react';
import {getAssignedProjects} from '../services/projectService';
import {getAssignedTasks} from '../services/taskService';

const normalizeError = (error) => {
	if (!error) {
		return 'Failed to load assigned work.';
	}

	const message = error?.message ?? error;
	return typeof message === 'string' && message.trim() ? message : 'Failed to load assigned work.';
};

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const useAssignedWork = () => {
	const [projects, setProjects] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const isMountedRef = useRef(true);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const loadAssignedWork = useCallback(async () => {
		if (!isMountedRef.current) {
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const [projectResponse, taskResponse] = await Promise.all([
				getAssignedProjects(),
				getAssignedTasks(),
			]);

			if (!isMountedRef.current) {
				return;
			}

			setProjects(ensureArray(projectResponse));
			setTasks(ensureArray(taskResponse));
		} catch (error) {
			if (!isMountedRef.current) {
				return;
			}

			setError(normalizeError(error));
		} finally {
			if (isMountedRef.current) {
				setIsLoading(false);
			}
		}
	}, []);

	useEffect(() => {
		loadAssignedWork();
	}, [loadAssignedWork]);

	return {
		projects,
		tasks,
		isLoading,
		error,
		reload: loadAssignedWork,
	};
};

export default useAssignedWork;
