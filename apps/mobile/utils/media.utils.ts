import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { type AppBskyEmbedImages } from '@atproto/api';
import { ImagePickerAsset } from 'expo-image-picker';

// const BLUESKY_MAX_SIZE = 976_560;
// const BLUESKY_MAX_DIMS = 2048;

class MediaUtils {
	static async fetchImageSize(
		url: string,
	): Promise<{ width: number; height: number }> {
		return new Promise((resolve, reject) => {
			Image.loadAsync(url)
				.then(({ width, height, scale }) => {
					resolve({ width: width * scale, height: height * scale });
				})
				.catch((e) => {
					reject(e);
				});
		});
	}

	// private static async compress_impl({
	// 	uri,
	// 	width,
	// 	height,
	// 	needsResize,
	// }: {
	// 	uri: string;
	// 	width?: number;
	// 	height?: number;
	// 	needsResize: boolean;
	// }) {
	// 	// compress iteratively, reducing quality each time
	// 	for (let i = 10; i > 0; i--) {
	// 		try {
	// 			// Float precision - not sure what's going on here
	// 			const factor = Math.round(i) / 10;
	// 			const compressed = await ImageManipulator.manipulateAsync(
	// 				uri,
	// 				needsResize ? [{ resize: { width, height } }] : [],
	// 				{
	// 					compress: factor,
	// 					base64: true,
	// 					format: ImageManipulator.SaveFormat.JPEG,
	// 				},
	// 			);
	//
	// 			if (!compressed.base64) throw new Error('[ERROR]: Failed to compress');
	//
	// 			const compressedSize = Math.round((compressed.base64?.length * 3) / 4);
	//
	// 			if (compressedSize < BLUESKY_MAX_SIZE) {
	// 				return compressed.uri;
	// 			}
	// 		} catch (err) {
	// 			throw new Error('[ERROR]: Failed to resize');
	// 		}
	// 	}
	// 	throw new Error('[ERROR]: Failed to compress');
	// }

	/**
	 * Credit to @mozzius | Graysky
	 *
	 * Resizes the image to maximum size allowed by Bluesky
	 *
	 * NOTE: Implementation on pause as debating whether to
	 * support this feature
	 *
	 * NOTE 2: This implementation is also outdated
	 * https://docs.expo.dev/versions/latest/sdk/imagemanipulator
	 */

	// private static async compressToMaxSize(image: ImagePicker.ImagePickerAsset) {
	// 	let uri = image.uri;
	// 	const size = image.fileSize ?? BLUESKY_MAX_SIZE + 1;
	// 	let targetWidth = BLUESKY_MAX_DIMS;
	// 	let targetHeight = BLUESKY_MAX_DIMS;
	//
	// 	const needsResize =
	// 		image.width > BLUESKY_MAX_DIMS || image.height > BLUESKY_MAX_DIMS;
	//
	// 	if (image.width > image.height) {
	// 		targetHeight = image.height * (BLUESKY_MAX_DIMS / image.width);
	// 	} else {
	// 		targetWidth = image.width * (BLUESKY_MAX_DIMS / image.height);
	// 	}
	//
	// 	// compress if > 1mb
	// 	if (size > BLUESKY_MAX_SIZE) {
	// 		uri = await this.compress_impl({
	// 			uri: image.uri,
	// 			width: targetWidth,
	// 			height: targetHeight,
	// 			needsResize,
	// 		});
	// 	}
	// 	return uri;
	// }

	/**
	 * Uploads an image item picked by
	 * expo to the Atproto asset server
	 * @param img picker object
	 * @param alt alt text (optional)
	 */
	async uploadAtproto(
		img: ImagePicker.ImagePickerAsset,
		alt?: string,
	): Promise<AppBskyEmbedImages.Image> {
		let agent: any = null;
		// const uri = await ImageUtils.compressToMaxSize(img);

		const uploaded = await agent.uploadBlob(img.uri, {
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

	static async pickImageFromDevice(): Promise<ImagePickerAsset | null> {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			quality: 1,
		});
		if (result.canceled || result.assets.length === 0) return null;
		return result.assets[0];
	}
}

export default MediaUtils;
