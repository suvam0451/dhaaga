type ResultPage<T> = {
	items: T[];
	maxId?: string | null;
	minId?: string | null;
	error?: Error;
};

const defaultResultPage = {
	items: [],
	maxId: null,
	minId: null,
};

export { defaultResultPage };
export type { ResultPage };
