import type { PostMediaAttachmentType } from '@dhaaga/bridge';
import { useEffect, useRef, useState } from 'react';
import MediaService from '../../services/media.service';
import MediaUtils from '../../utils/media.utils';
import { useImage } from 'expo-image';

/**
 * calculates the image width
 * for a fixed height container
 *
 * @param imageUrl
 * @param maxH
 * @param defaultW
 */
export function useImageAutoHeight(
	imageUrl: string,
	maxH?: number,
	defaultW?: number,
) {
	const DEFAULT_WIDTH = 240;
	const DEFAULT_HEIGHT = 240;

	const _maxH = maxH || DEFAULT_HEIGHT;
	const _maxW = defaultW || DEFAULT_WIDTH;
	const image = useImage({ uri: imageUrl, height: _maxH });

	return {
		resolved: true,
		height: _maxH,
		width: image ? (_maxH / image.height) * image.width : _maxW,
	};
}

/**
 * calculates the image width
 * for a fixed height container
 */
export function useImageAutoWidth(
	item: PostMediaAttachmentType,
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
		MediaUtils.fetchImageSize(item.url)
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
