import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import {
	type AppBskyEmbedImages,
	AtpAgent,
	ComAtprotoRepoUploadBlob,
} from '@atproto/api';
import { ImagePickerAsset } from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

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
	 * Thanks to Graysky
	 * @param agent
	 * @param input
	 * @param encoding
	 */
	static async uploadBlob(
		agent: AtpAgent,
		input: string | Blob,
		encoding?: string,
	): Promise<ComAtprotoRepoUploadBlob.Response> {
		if (typeof input === 'string' && input.startsWith('file:')) {
			const blob = await MediaUtils.asBlob(input);
			return agent.uploadBlob(blob, { encoding });
		}

		if (typeof input === 'string' && input.startsWith('/')) {
			const blob = await MediaUtils.asBlob(`file://${input}`);
			return agent.uploadBlob(blob, { encoding });
		}

		if (typeof input === 'string' && input.startsWith('data:')) {
			const blob = await fetch(input).then((r) => r.blob());
			return agent.uploadBlob(blob, { encoding });
		}

		if (input instanceof Blob) {
			return agent.uploadBlob(input, { encoding });
		}

		throw new TypeError(`Invalid uploadBlob input: ${typeof input}`);
	}

	/**
	 * Uploads an image item picked by
	 * expo to the Atproto asset server
	 * @param img picker object
	 * @param alt alt text (optional)
	 *
	 * @deprecated
	 */
	static async uploadAtproto(
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

	// HACK (thanks Graysky!)
	// React native has a bug that inflates the size of jpegs on upload
	// we get around that by renaming the file ext to .bin
	// see https://github.com/facebook/react-native/issues/27099
	// -prf
	static async withSafeFile<T>(
		uri: string,
		fn: (path: string) => Promise<T>,
	): Promise<T> {
		if (uri.endsWith('.jpeg') || uri.endsWith('.jpg')) {
			// Since we don't "own" the file, we should avoid renaming or modifying it.
			// Instead, let's copy it to a temporary file and use that (then remove the
			// temporary file).
			const newPath = uri.replace(/\.jpe?g$/, '.bin');
			try {
				// await RNFS.copyFile(uri, newPath);
				await FileSystem.copyAsync({
					from: uri,
					to: newPath,
				});
			} catch {
				// Failed to copy the file, just use the original
				return await fn(uri);
			}
			try {
				return await fn(newPath);
			} finally {
				// Remove the temporary file
				// await RNFS.unlink(newPath);
				await FileSystem.deleteAsync(newPath).catch(() => {});
			}
		} else {
			return fn(uri);
		}
	}

	static async asBlob(uri: string): Promise<Blob> {
		return MediaUtils.withSafeFile(uri, async (safeUri) => {
			// Note (thanks Graysky!)
			// Android does not support `fetch()` on `file://` URIs. for this reason, we
			// use XMLHttpRequest instead of simply calling:

			// return fetch(safeUri.replace('file:///', 'file:/')).then(r => r.blob())

			return await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.onload = () => resolve(xhr.response);
				xhr.onerror = () => reject(new Error('Failed to load blob'));
				xhr.responseType = 'blob';
				xhr.open('GET', safeUri, true);
				xhr.send(null);
			});
		});
	}
}

export default MediaUtils;
