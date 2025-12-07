import { PostMediaAttachmentType } from '#/types/index.js';

class Viewer {
	static isImage(input: PostMediaAttachmentType) {
		return [
			'image',
			'image/jpeg',
			'image/png',
			'image/webp',
			'image/gif',
			'image/avif',
		].includes(input.type);
	}

	static isVideo(input: PostMediaAttachmentType) {
		return [
			'video',
			'video/mp4',
			'video/webm',
			'gifv',
			'video/quicktime',
		].includes(input.type);
	}

	static isAnimatedImage(input: PostMediaAttachmentType) {
		return ['image/gif', 'gifv'].includes(input.type);
	}

	static isAudio(input: PostMediaAttachmentType) {
		return ['audio', 'audio/mpeg'].includes(input.type);
	}

	static hasAltText(input: PostMediaAttachmentType) {}

	static getAltText(input: PostMediaAttachmentType) {}
}

export { Viewer as MediaAttachmentViewer };
