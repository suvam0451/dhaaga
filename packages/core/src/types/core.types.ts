export type ResultPage<T> = {
	items: T[];
	maxId: string | null;
	minId: string | null;
	isLoaded: boolean;
	error?: Error;
};

export const defaultResultPage = {
	items: [],
	maxId: null,
	minId: null,
	isLoaded: false,
};
