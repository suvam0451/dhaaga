class Service {
	static isImage(mimeType: string) {
		return [
			'image',
			'image/avif',
			'image/jpeg',
			'image/png',
			'image/webp',
			'gifv',
			'image/gif',
		].includes(mimeType);
	}
	static isVideo(mimeType: string) {
		return ['video', 'video/mp4', 'video/webm', 'video/quicktime'].includes(
			mimeType,
		);
	}
	static isAnimatedImage(mimeType: string) {
		return ['gifv', 'image/gif'].includes(mimeType);
	}
	static isAudio(mimeType: string) {
		return ['audio', 'audio/mpeg'].includes(mimeType);
	}

	/**
	 *
	 * @param maxW width of parent container
	 * @param maxH maximum permissible height allowed
	 * @param W
	 * @param H
	 * @param allowCrop
	 */
	static calculateDimensions({
		maxW,
		maxH = 720,
		W,
		H,
		allowCrop = false,
	}: {
		maxH: number;
		maxW: number;
		H: number;
		W: number;
		allowCrop?: boolean;
	}) {
		if (!W || !H) return { height: maxH, width: maxW };

		// fix width, get height
		let _H = (maxW / W) * H;
		let _W = maxW;

		if (_H > maxH) {
			// fix height, get width
			_H = maxH;
			_W = (maxH / H) * W;
		}

		return {
			width: _W,
			height: _H,
		};
	}
}

export { Service as MediaService };
