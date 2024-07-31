import { useCallback, useEffect, useState } from 'react';

function useCircularList(total: number, hash: string) {
	const [Pointer, setPointer] = useState(0);

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

	return { Pointer, onNext, onPrev };
}

export default useCircularList;
