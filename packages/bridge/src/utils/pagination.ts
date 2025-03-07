class Util {
	private oldest: string | null;
	private newest: string | null;
	private pageSize: number;
	public maxId: string | null;

	constructor(pageSize: number = 20) {
		this.oldest = null;
		this.newest = null;
		this.maxId = null;
		this.pageSize = pageSize;
	}

	setMaxId(maxId: string | null) {
		this.maxId = maxId;
	}

	loadNext() {
		this.maxId = this.newest;
	}
}

type ResultPage<T> = {
	items: T[];
	maxId: string | null;
	minId: string | null;
	error?: Error;
};

const defaultResultPage = {
	items: [],
	maxId: null,
	minId: null,
};

export { Util as PaginationUtil, defaultResultPage };
export type { ResultPage };
