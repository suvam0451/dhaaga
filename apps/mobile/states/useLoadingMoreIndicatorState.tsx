import { FetchStatus } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import useSkeletonSmoothTransition from './useSkeletonTransition';

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
	 * It just makes sure the loading indicator ticks
	 * for a bit more, while the posts are being loaded
	 * in the background for user.
	 *
	 * Fast scrolling, especially in longer lists will
	 * cause app to lag
	 */
	// const forceLoadingState =
	// 	additionalLoadingStates !== undefined ? additionalLoadingStates : false;
	// const overallLoading = fetchStatus === 'fetching' || forceLoadingState;
	// const loading = useSkeletonSmoothTransition(overallLoading, {
	// 	condition: fetchStatus === 'idle' || forceLoadingState,
	// 	preventLoadingForCondition: false,
	// });

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
			}, 420);
		} else {
			clearTimeout(timeoutRef.current);
			setExtendedLoading(true);
		}
	};

	useEffect(() => {
		debounceFn(fetchStatus === 'fetching');
		return () => clearTimeout(timeoutRef.current);
	}, [fetchStatus]);

	return useMemo(() => {
		if (extendedLoading) {
			return {
				visible: true,
				loading: true,
			};
		} else {
			return {
				visible: false,
				loading: false,
			};
		}
	}, [extendedLoading]);
}

export default useLoadingMoreIndicatorState;
