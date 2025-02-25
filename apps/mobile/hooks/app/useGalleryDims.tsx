import { useEffect, useRef, useState } from 'react';
import { Dimensions, LayoutChangeEvent } from 'react-native';
import MediaService from '../../services/media.service';
import { Image as RNImage } from 'react-native';
import { MEDIA_CONTAINER_MAX_HEIGHT } from '../../components/common/media/_common';

type ImageAspectRatioProps = {
	url: string;
	width?: number;
	height?: number;
}[];

/**
 * Calculates the expected height for
 * a timeline carousal
 *
 * NOTE: limited to supporting full-width
 * carousals, for now.
 */
function useGalleryDims(items: ImageAspectRatioProps) {
	// set width
	const [ImageWidth, setImageWidth] = useState(
		Dimensions.get('window').width - 20,
	);
	// set height
	const [ImageHeight, setImageHeight] = useState(MEDIA_CONTAINER_MAX_HEIGHT);
	// set container
	const [ContainerWidth, setContainerWidth] = useState(
		Dimensions.get('window').width - 20,
	);
	const [ContainerHeight, setContainerHeight] = useState(
		MEDIA_CONTAINER_MAX_HEIGHT,
	);

	function onLayoutChanged(event: LayoutChangeEvent) {
		// console.log('layout event fired');
		const { height, width } = event.nativeEvent.layout;
		// do not update values if seeded
		setContainerWidth(width);
		setContainerHeight(Math.min(height, MEDIA_CONTAINER_MAX_HEIGHT));
	}

	// avoid rate limits due to infinite loops
	const cache = useRef(new Map<string, { width: number; height: number }>());

	/**
	 * reset to max width/height
	 * for parent container
	 */
	useEffect(() => {
		if (items.length === 1) {
			setContainerHeight(MEDIA_CONTAINER_MAX_HEIGHT);
			setImageWidth(items[0].width || Dimensions.get('window').width - 20);
			// setImageHeight(items[0].height || 0);
		} else {
			setContainerHeight(MEDIA_CONTAINER_MAX_HEIGHT);
			setImageWidth(Dimensions.get('window').width - 20);
			// setImageHeight(0);
		}
	}, [items]);

	async function CalculateSize(
		url: string,
		seedW: number,
		seedH: number,
	): Promise<{ width: number; height: number }> {
		if (cache.current.has(url)) {
			return cache.current.get(url);
		}
		return new Promise((resolve, reject) => {
			RNImage.getSize(
				url,
				(W, H) => {
					const { width, height } = MediaService.calculateDimensions({
						maxW: seedW,
						maxH: seedH,
						H,
						W,
					});
					cache.current.set(url, { width, height });
					resolve({ width, height });
				},
				(error) => {
					// console.log('[WARN]: failed to get image', url, error);
					cache.current.set(url, { width: seedW, height: seedH });
					resolve({ width: seedW, height: seedH });
				},
			);
		});
	}

	async function recalculateSizes() {
		if (items.length === 0) {
			setImageHeight(0);
			setContainerHeight(0);
			return;
		}

		// Maximum allowable dimensions height for containers
		const _width = ContainerWidth;
		const _height = ContainerHeight;

		let _resultHeight = 0;
		let _resultWidth = ContainerWidth;

		for (const item of items) {
			if (item.width && item.height) {
				const { width, height } = MediaService.calculateDimensions({
					maxW: _width,
					maxH: _height,
					H: item.height,
					W: item.width,
				});
				_resultHeight = Math.max(_resultHeight, height);
				_resultWidth = Math.min(_resultWidth, width);
			} else {
				const { width, height } = await CalculateSize(
					item.url,
					_width,
					_height,
				);
				_resultHeight = Math.max(_resultHeight, height);
				_resultWidth = Math.min(_resultWidth, width);
			}
		}

		// container dims
		setContainerHeight(_resultHeight);
		// image dims
		setImageHeight(_resultHeight);
		setImageWidth(_resultWidth);
	}

	useEffect(() => {
		recalculateSizes();
	}, [items, ContainerWidth]);

	return {
		ContainerWidth,
		ContainerHeight,
		ImageWidth,
		ImageHeight,
		onLayoutChanged,
		setHeight: setImageHeight,
	};
}

export default useGalleryDims;
