import { FetchStatus } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

type Props = {
	fetchStatus: FetchStatus;
	additionalLoadingStates?: boolean;
};

/**
 * Manages the state for the bottom indicator
 * that pops up for modules with infinite
 * scrolling support
 *
 * NOTE: only compatible with Tanstack useQuery
 */
function useLoadingMoreIndicatorState({
	fetchStatus,
	additionalLoadingStates,
}: Props) {
	/**
	 * 	show the loading indicator for an extended
	 * 	amount of time
	 */
	const [extendedLoading, setExtendedLoading] = useState(false);
	const timeoutRef = useRef(null);
	const debounceFn = (state: boolean) => {
		if (state === false && extendedLoading === true) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => {
				setExtendedLoading(false);
			}, 200);
		} else {
			clearTimeout(timeoutRef.current);
			setExtendedLoading(true);
		}
	};

	useEffect(() => {
		debounceFn(fetchStatus === 'fetching');
		return () => clearTimeout(timeoutRef.current);
	}, [fetchStatus]);

	return {
		visible: fetchStatus !== 'idle',
		loading: fetchStatus === 'fetching',
	};
}

export default useLoadingMoreIndicatorState;
