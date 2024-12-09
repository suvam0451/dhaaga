import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { type AppBskyEmbedImages } from '@atproto/api';

/**
 * Credit to @mozzius | Graysky
 */

const BLUESKY_MAX_SIZE = 976_560;
const BLUESKY_MAX_DIMS = 2048;

class AtprotoAssetManagerService {
	private static async compress({
		uri,
		width,
		height,
		needsResize,
	}: {
		uri: string;
		width?: number;
		height?: number;
		needsResize: boolean;
	}) {
		// compress iteratively, reducing quality each time
		for (let i = 10; i > 0; i--) {
			try {
				// Float precision - not sure what's going on here
				const factor = Math.round(i) / 10;
				const compressed = await ImageManipulator.manipulateAsync(
					uri,
					needsResize ? [{ resize: { width, height } }] : [],
					{
						compress: factor,
						base64: true,
						format: ImageManipulator.SaveFormat.JPEG,
					},
				);

				if (!compressed.base64) throw new Error('[ERROR]: Failed to compress');

				const compressedSize = Math.round((compressed.base64?.length * 3) / 4);

				if (compressedSize < BLUESKY_MAX_SIZE) {
					return compressed.uri;
				}
			} catch (err) {
				throw new Error('[ERROR]: Failed to resize');
			}
		}
		throw new Error('[ERROR]: Failed to compress');
	}

	private static async compressToMaxSize(image: ImagePicker.ImagePickerAsset) {
		let uri = image.uri;
		const size = image.fileSize ?? BLUESKY_MAX_SIZE + 1;
		let targetWidth = BLUESKY_MAX_DIMS;
		let targetHeight = BLUESKY_MAX_DIMS;

		const needsResize =
			image.width > BLUESKY_MAX_DIMS || image.height > BLUESKY_MAX_DIMS;

		if (image.width > image.height) {
			targetHeight = image.height * (BLUESKY_MAX_DIMS / image.width);
		} else {
			targetWidth = image.width * (BLUESKY_MAX_DIMS / image.height);
		}

		// compress if > 1mb
		if (size > BLUESKY_MAX_SIZE) {
			uri = await AtprotoAssetManagerService.compress({
				uri: image.uri,
				width: targetWidth,
				height: targetHeight,
				needsResize,
			});
		}
		return uri;
	}

	/**
	 * Uploads an image item picked by
	 * expo to the Atproto asset server
	 * @param img picker object
	 * @param alt alt text (optional)
	 */
	async upload(img: ImagePicker.ImagePickerAsset, alt?: string) {
		let agent: any = null;
		const uri = await AtprotoAssetManagerService.compressToMaxSize(img);

		const uploaded = await agent.uploadBlob(uri, {
			encoding: 'image/jpeg',
		});
		if (!uploaded.success) {
			console.log('[ERROR]: failed to upload image asset');
			return null;
		}
		return {
			image: uploaded.data.blob,
			alt: alt.trim(),
			aspectRatio: {
				width: img.width,
				height: img.height,
			},
		} satisfies AppBskyEmbedImages.Image;
	}
}

export default AtprotoAssetManagerService;
