import { useEffect, useState } from 'react';
import { Image as RNImage } from 'react-native';

const MAX_H = 20;

/**
 * Evaluate the dimension of emoji to render
 * @param url
 * @param height
 * @param width
 */
function useReactionDimension({
	url,
	height,
	width,
}: {
	url: string;
	height?: number;
	width?: number;
}) {
	const [Dims, setDims] = useState({ H: MAX_H, W: MAX_H });

	useEffect(() => {
		if (
			height !== undefined &&
			height !== null &&
			width !== undefined &&
			width !== null
		) {
			setDims({ H: MAX_H, W: (MAX_H / height) * width });
		}

		RNImage.getSize(url, (width, height) => {
			setDims({ H: Dims.H, W: (MAX_H / height) * width });
		});
	}, [url]);

	return Dims;
}

export default useReactionDimension;
