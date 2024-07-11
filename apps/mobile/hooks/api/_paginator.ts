import { useRef } from 'react';

function useAppQueryPaginator() {
	// are there no more pages to load?
	const EOL = useRef(false);
	// id of the oldest known post (i.e. - most recent)
	const oldest = useRef(null);
	// id of the latest known post (i.e. - most oldest)
	const latest = useRef(null);

	// current
	const currentMaxId = useRef(null);
	const currentMinId = useRef(null);

	/**
	 * Since we are pushing maxId,
	 * it is expected that minId should become null
	 * @param minId
	 * @param maxId
	 */
	function pushMaxId(minId: string, maxId: string) {
		if (latest.current === null) latest.current = minId;
		oldest.current = maxId;
	}

	/**
	 * a.k.a. -- scroll older posts (usually bottom)
	 */
	function applyMaxId() {
		currentMaxId.current = oldest.current;
		currentMinId.current = null;
	}

	return { EOL, pushMaxId, applyMaxId, currentMaxId, currentMinId };
}
