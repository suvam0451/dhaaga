import { useRef, useState } from 'react';
import { randomUUID } from 'expo-crypto';

/**
 *
 */
function useHookLoadingState() {
	const [State, setState] = useState(randomUUID());

	const IsLoading = useRef(false);

	function forceUpdate() {
		IsLoading.current = false;
		setState(randomUUID());
	}

	function setLoading() {
		IsLoading.current = true;
		setState(randomUUID());
	}

	return { State, setLoading, forceUpdate };
}

export default useHookLoadingState;
