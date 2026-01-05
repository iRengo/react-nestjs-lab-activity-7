export const normalizeStatus = (status) => (status ?? '').toString().toLowerCase();

export const isTaskCompleted = (status) => {
	const normalized = normalizeStatus(status);
	return ['completed', 'complete', 'done', 'resolved'].includes(normalized);
};

export const getDateOrNull = (value) => {
	if (!value) {
		return null;
	}

	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
};
