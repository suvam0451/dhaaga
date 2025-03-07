import { useCallback, useEffect, useRef, useState } from 'react';
import {
	Directions,
	FlingGestureHandlerEventPayload,
	Gesture,
	GestureStateChangeEvent,
} from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

/**
 *
 * @param total
 * @param hash
 */
function useCircularListSwipe(total: number, hash: string) {
	const [Pointer, setPointer] = useState(0);
	const start =
		useRef<GestureStateChangeEvent<FlingGestureHandlerEventPayload>>();
	const end =
		useRef<GestureStateChangeEvent<FlingGestureHandlerEventPayload>>();

	useEffect(() => {
		setPointer(0);
	}, [hash]);

	const onNext = useCallback(() => {
		setPointer((o) => {
			if (o + 1 === total) return 0;
			return o + 1;
		});
	}, [total]);

	const onPrev = useCallback(() => {
		setPointer((o) => {
			if (o === 0) return total - 1;
			return o - 1;
		});
	}, [total]);

	function yoink() {
		if (start.current.absoluteX > end.current.absoluteX) {
			onNext();
		} else {
			onPrev();
		}
	}

	const fling = Gesture.Fling()
		.direction(Directions.LEFT | Directions.RIGHT)
		.onBegin((event) => {
			start.current = event;
		})
		.onEnd((event) => {
			end.current = event;
			runOnJS(yoink)();
		});

	return { Pointer, fling };
}

export default useCircularListSwipe;
