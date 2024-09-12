import { useEffect, useRef, useState } from 'react';
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
 */
function useImageAspectRatio(
	items: ImageAspectRatioProps,
	seed?: { width?: number; height?: number },
) {
	// set width
	const [ImageWidth, setImageWidth] = useState(Dimensions.get('window').width);
	// set height
	const [ImageHeight, setImageHeight] = useState(MEDIA_CONTAINER_MAX_HEIGHT);
	// set container
	const [ContainerWidth, setContainerWidth] = useState(
		Dimensions.get('window').width,
	);
	const [ContainerHeight, setContainerHeight] = useState(
		MEDIA_CONTAINER_MAX_HEIGHT,
	);

	// avoid rate limits due to infinite loops
	const cache = useRef(new Map<string, { width: number; height: number }>());

	/**
	 * reset to max width/height
	 * for parent container
	 */
	useEffect(() => {
		setContainerHeight(MEDIA_CONTAINER_MAX_HEIGHT);
		setImageWidth(Dimensions.get('window').width);
		setImageHeight(0);
	}, [items]);

	// console.log('setting height', Height);

	function onLayoutChanged(event: LayoutChangeEvent) {
		// console.log('layout event fired');
		const { height, width } = event.nativeEvent.layout;
		// do not update values if seeded
		setContainerWidth(width);
		if (!seed?.height) setContainerHeight(Math.min(height, ImageHeight));
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
					console.log('[WARN]: failed to get image', url, error);
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
		const _height = MEDIA_CONTAINER_MAX_HEIGHT;

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
		recalculateSizes().then(() => {});
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

export default useImageAspectRatio;
