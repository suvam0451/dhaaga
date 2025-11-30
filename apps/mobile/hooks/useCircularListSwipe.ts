import { useCallback, useEffect, useState } from 'react';
import { Directions, Gesture } from 'react-native-gesture-handler';

/**
 *
 * @param total
 * @param hash
 */
function useCircularListSwipe(total: number, hash: string) {
	const [Pointer, setPointer] = useState(0);
	let startX = 0;
	let finalX = 0;

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
		if (startX > finalX) {
			onNext();
		} else {
			onPrev();
		}
	}

	const fling = Gesture.Fling()
		.runOnJS(true)
		.direction(Directions.LEFT | Directions.RIGHT)
		.onBegin((event) => {
			startX = event.absoluteX;
		})
		.onEnd((event) => {
			finalX = event.absoluteX;
			yoink();
		});

	return { Pointer, fling };
}

export default useCircularListSwipe;
