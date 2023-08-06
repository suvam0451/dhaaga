import React from "react";
import { NotifyOnChangeProps } from "@tanstack/query-core";
import { useFocusEffect } from "@react-navigation/native";

/**
 * Disables re-renders on out of focus Screens
 * @param notifyOnChangeProps
 * @returns
 */
export function useFocusNotifyOnChangeProps(
	notifyOnChangeProps?: NotifyOnChangeProps
) {
	const focusedRef = React.useRef(true);

	useFocusEffect(
		React.useCallback(() => {
			focusedRef.current = true;

			return () => {
				focusedRef.current = false;
			};
		}, [])
	);

	return () => {
		if (!focusedRef.current) {
			return [];
		}

		if (typeof notifyOnChangeProps === "function") {
			return notifyOnChangeProps();
		}

		// @ts-ignore
		return notifyOnChangeProps.current;
	};
}
