import { AppActivityPubMediaType } from '../../types/app-post.types';
import { useEffect, useRef, useState } from 'react';
import MediaService from '../../services/media.service';
import ImageUtils from '../../utils/image.utils';

/**
 * calculates the image width
 * for a fixed height container
 */
export function useImageAutoHeight(
	item: AppActivityPubMediaType,
	W: number,
	maxH: number,
) {
	const [Data, setData] = useState({ resolved: false, height: maxH, width: W });
	const ValueRef = useRef(null);
	useEffect(() => {
		if (!item) {
			setData({
				resolved: false,
				height: maxH,
				width: W,
			});
			return;
		}
		if (ValueRef.current === item.previewUrl) return;
		setData({
			resolved: false,
			height: maxH,
			width: W,
		});

		/**
		 * Use image dimensions provided
		 * by server to calculate dimensions
		 */
		if (item.height && item.width) {
			const { height } = MediaService.calculateDimensions({
				maxW: W,
				maxH,
				H: item.height,
				W: item.width,
			});
			setData({ resolved: true, height, width: W });
			ValueRef.current = item.previewUrl;
			return;
		}

		/**
		 * Fetch the original image size
		 * to calculate dimensions
		 */
		ImageUtils.fetchImageSize(item.url)
			.then(({ width: rnWidth, height: rnHeight }) => {
				const { height } = MediaService.calculateDimensions({
					maxW: W,
					maxH,
					H: rnHeight,
					W: rnWidth,
				});
				setData({ resolved: false, height, width: W });
			})
			.finally(() => {
				setData({
					...Data,
					resolved: true,
				});
				ValueRef.current = item.previewUrl;
			});
	}, [item]);

	return Data;
}

/**
 * calculates the image width
 * for a fixed height container
 */
export function useImageAutoWidth(
	item: AppActivityPubMediaType,
	H: number,
	maxW: number,
) {
	const [Data, setData] = useState({ resolved: false, height: H, width: maxW });
	const ValueRef = useRef(null);
	useEffect(() => {
		if (ValueRef.current === item.previewUrl) return;
		setData({
			resolved: false,
			height: H,
			width: maxW,
		});

		/**
		 * Use image dimensions provided
		 * by server to calculate dimensions
		 */
		if (item.height && item.width) {
			const { width } = MediaService.calculateDimensions({
				maxW,
				maxH: H,
				H: item.height,
				W: item.width,
			});
			setData({ resolved: true, height: H, width });
			ValueRef.current = item.previewUrl;
			return;
		}

		/**
		 * Fetch the original image size
		 * to calculate dimensions
		 */
		ImageUtils.fetchImageSize(item.url)
			.then(({ width: rnWidth, height: rnHeight }) => {
				const { width } = MediaService.calculateDimensions({
					maxW,
					maxH: H,
					H: rnHeight,
					W: rnWidth,
				});
				setData({ resolved: false, height: H, width });
			})
			.finally(() => {
				setData({
					...Data,
					resolved: true,
				});
				ValueRef.current = item.previewUrl;
			});
	}, [item]);

	return Data;
}
