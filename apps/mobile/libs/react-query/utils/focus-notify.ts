import { NotifyOnChangeProps } from '@tanstack/query-core';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef } from 'react';

/**
 * Disables re-renders on out of focus Screens
 * @param notifyOnChangeProps
 * @returns
 */
export function useFocusNotifyOnChangeProps(
	notifyOnChangeProps?: NotifyOnChangeProps,
) {
	const focusedRef = useRef(true);

	useFocusEffect(
		useCallback(() => {
			focusedRef.current = true;

			return () => {
				focusedRef.current = false;
			};
		}, []),
	);

	return () => {
		if (!focusedRef.current) {
			return [];
		}

		if (typeof notifyOnChangeProps === 'function') {
			return notifyOnChangeProps();
		}

		// @ts-ignore
		return notifyOnChangeProps.current;
	};
}
