import { useEffect, useState } from 'react';
import { Dimensions, LayoutChangeEvent } from 'react-native';
import MediaService from '../../services/media.service';
import { Image as RNImage } from 'react-native';

type ImageAspectRatioProps = {
	url: string;
	width?: number;
	height?: number;
}[];

const MEDIA_CONTAINER_MAX_HEIGHT = 540;

/**
 * Estimate the height for the
 * image or carousal
 *
 * NOTE: Only works for react-native
 */
function useImageAspectRatio(
	items: ImageAspectRatioProps,
	seed?: { width?: number; height?: number },
) {
	// set width
	const [Width, setWidth] = useState(
		seed?.width || Dimensions.get('window').width,
	);
	// set height
	const [Height, setHeight] = useState(
		seed?.height || MEDIA_CONTAINER_MAX_HEIGHT,
	);

	// useEffect(() => {
	// 	if (seed?.width) setWidth(seed?.width);
	// 	if (seed?.height) setHeight(seed?.height);
	// }, [seed]);

	// console.log('setting height', Height);

	function onLayoutChanged(event: LayoutChangeEvent) {
		// console.log('layout event fired');
		const { height, width } = event.nativeEvent.layout;
		// do not update values if seeded
		if (!seed?.width) setWidth(width);
		if (!seed?.height) setHeight(Math.min(height, Height));
	}

	/**
	 * Helper function to get dimensions
	 * for individual items
	 * @param url
	 */
	const getImageSize = async (
		url: string,
	): Promise<{ width: number; height: number }> =>
		new Promise((resolve, reject) => {
			RNImage.getSize(
				url,
				(width, height) => {
					resolve({ width, height });
				},
				(error) => reject(error),
			);
		});

	useEffect(() => {
		// console.log('invoked...', Width);
		if (items.length === 0) {
			setHeight(0);
			return;
		}

		const _width = seed?.width || Width;
		const _height = seed?.height || Height;

		for (const item of items) {
			if (item.width && item.height) {
				const { width, height } = MediaService.calculateDimensions({
					maxW: _width,
					maxH: _height,
					H: item.height,
					W: item.width,
				});
				setHeight((o) => Math.min(o, height));
			} else {
				// console.log('getting size manually');
				// calculate ourselves
				RNImage.getSize(
					item.url,
					(W, H) => {
						const { height } = MediaService.calculateDimensions({
							maxW: _width,
							maxH: _height,
							H,
							W,
						});
						setHeight(height);
					},
					(error) => {
						console.log('[WARN]: failed to get image', error);
						setHeight(MEDIA_CONTAINER_MAX_HEIGHT);
					},
				);
			}
		}
	}, [items, Width, Height, seed]);

	return { Width, Height, onLayoutChanged };
}

export default useImageAspectRatio;
