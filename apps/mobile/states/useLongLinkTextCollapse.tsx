import {
	NativeSyntheticEvent,
	TextLayoutEventData,
} from 'react-native/Libraries/Types/CoreEventTypes';
import { useEffect, useState } from 'react';

/**
 * Use this to collapse long link texts
 * @param input
 * @param desiredMaxWidth
 */
function useLongLinkTextCollapse(input: string, desiredMaxWidth: number) {
	const [Result, setResult] = useState('');
	const [IsEvaluated, setIsEvaluated] = useState(false);

	useEffect(() => {
		if (IsEvaluated || input === '' || !input) return;
		if (input.length > desiredMaxWidth) {
			setResult(input.slice(0, desiredMaxWidth) + '...');
		} else {
			setResult(input);
		}
	}, [input]);

	function onTextLayout(e: NativeSyntheticEvent<TextLayoutEventData>) {
		console.log(e.nativeEvent.target.toString().length);
		if (e.nativeEvent.target.toString().length > desiredMaxWidth) {
			setResult(
				e.nativeEvent.target.toString().slice(0, desiredMaxWidth) + '...',
			);
		} else {
			setResult(input);
		}
	}

	return { onTextLayout, Result };
}

export default useLongLinkTextCollapse;
