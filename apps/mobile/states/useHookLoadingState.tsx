import { useRef, useState } from 'react';
import { RandomUtil } from '@dhaaga/core';

/**
 *
 */
function useHookLoadingState() {
	const [State, setState] = useState(RandomUtil.nanoId());

	const IsLoading = useRef(false);

	function forceUpdate() {
		IsLoading.current = false;
		setState(RandomUtil.nanoId());
	}

	function setLoading() {
		IsLoading.current = true;
		setState(RandomUtil.nanoId());
	}

	return { State, setLoading, forceUpdate };
}

export default useHookLoadingState;
