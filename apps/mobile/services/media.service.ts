import { MediaAttachmentInterface } from '@dhaaga/shared-abstraction-activitypub';
import { ActivityPubMediaAttachment } from '../entities/activitypub-media-attachment.entity';

class MediaService {
	static calculateDimensions({
		maxW,
		maxH,
		W,
		H,
	}: {
		maxH: number;
		maxW: number;
		H: number;
		W: number;
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

	static calculateHeightForMediaContentCarousal(
		items: MediaAttachmentInterface[],
		{
			maxHeight,
			deviceWidth,
		}: {
			maxHeight: number;
			deviceWidth: number;
		},
	) {
		if (!items) return;
		let MIN_HEIGHT = 0;
		for (const item of items) {
			let seedWidth = item.getWidth();
			let seedHeight = item.getHeight();

			// console.log('[INFO]: image dims', seedHeight, seedHeight);
			// if (!seedWidth || !seedHeight) {
			// 	await RNImage.getSize(item.getUrl(), (width, height) => {
			// 		console.log(item.getUrl(), width, height);
			// 		seedWidth = width;
			// 		seedHeight = height;
			// 	});
			// 	console.log(
			// 		'[INFO]: manually resolved image dims',
			// 		seedHeight,
			// 		seedHeight,
			// 	);
			// }

			const { height } = this.calculateDimensions({
				maxW: deviceWidth,
				maxH: maxHeight,
				H: seedHeight,
				W: seedWidth,
			});
			MIN_HEIGHT = Math.max(MIN_HEIGHT, height);
		}
		return MIN_HEIGHT;
	}

	static calculateHeightRealmAttachments(
		items: ActivityPubMediaAttachment[],
		{
			maxHeight,
			deviceWidth,
		}: {
			maxHeight: number;
			deviceWidth: number;
		},
	) {
		let MIN_HEIGHT = 0;
		for (const item of items) {
			const width = item.width;
			const height = item.height;

			if (height && height > MIN_HEIGHT) {
				const multiplier = deviceWidth / width;
				MIN_HEIGHT = Math.min(height * multiplier, maxHeight);
			}
		}
		return MIN_HEIGHT;
	}
}

export default MediaService;
