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
function useImageAspectRatio(items: ImageAspectRatioProps) {
	// set width
	const [Width, setWidth] = useState(Dimensions.get('window').width);
	// set height
	const [Height, setHeight] = useState(MEDIA_CONTAINER_MAX_HEIGHT);

	function onLayoutChanged(event: LayoutChangeEvent) {
		const { height, width } = event.nativeEvent.layout;
		setWidth(width);
		setHeight(Math.min(height, Height));
	}

	useEffect(() => {
		if (items.length === 0) {
			setHeight(0);
			return;
		}

		setHeight(0);

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

		for (const item of items) {
			if (item.width && item.height) {
				const { width, height } = MediaService.calculateDimensions({
					maxW: Width,
					maxH: MEDIA_CONTAINER_MAX_HEIGHT,
					H: item.height,
					W: item.width,
				});
				setHeight((o) => Math.max(o, height));
				// setWidth(width);
			} else {
				// calculate ourselves
				RNImage.getSize(
					item.url,
					(W, H) => {
						const { height } = MediaService.calculateDimensions({
							maxW: Width,
							maxH: MEDIA_CONTAINER_MAX_HEIGHT,
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
	}, [items, Width]);

	return { Width, Height, onLayoutChanged };
}

export default useImageAspectRatio;
