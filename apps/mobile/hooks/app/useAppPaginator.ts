import { useRef, useState } from 'react';

/**
 * Supports forward/reverse
 * pagination support
 */
function useAppPaginator() {
	/**
	 * use this to store the first element
	 * in current list
	 * */
	const firstId = useRef<string>(null);
	/**
	 * use this to store the last element
	 * in current list
	 * */
	const lastId = useRef<string>(null);

	/**
	 * These will trigger the api query
	 * with updated params
	 */
	const [MaxId, setMaxId] = useState(null);
	const [MinId, setMinId] = useState(null);

	function loadNext() {
		setMaxId(lastId.current);
	}

	function loadPrevious() {
		setMinId(firstId.current);
	}

	function reset() {
		setMaxId(null);
		setMinId(null);
	}

	return { firstId, lastId, MaxId, MinId, loadNext, loadPrevious, reset };
}

export default useAppPaginator;
