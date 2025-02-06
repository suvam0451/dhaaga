import { MediaAttachmentInterface } from '@dhaaga/bridge';
import { SavedPostMediaAttachment } from '../database/_schema';

type CarousalContainerSpecificationType = {
	maxHeight: number;
	maxWidth: number;
};

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

	static calculateHeightForLocalMediaCarousal(
		items: SavedPostMediaAttachment[],
		{ maxHeight, maxWidth }: CarousalContainerSpecificationType,
	) {
		if (!items) return;
		let MIN_HEIGHT = 0;

		try {
			for (const item of items) {
				let seedWidth = item.width;
				let seedHeight = item.height;

				const { height } = this.calculateDimensions({
					maxW: maxWidth,
					maxH: maxHeight,
					H: seedHeight,
					W: seedWidth,
				});
				MIN_HEIGHT = Math.max(MIN_HEIGHT, height);
			}
		} catch (e) {
			console.error(
				'[ERROR]: calculating estimated height for media attachments',
				e,
				items,
			);
		}
		return MIN_HEIGHT;
	}

	static calculateHeightForMediaContentCarousal(
		items: MediaAttachmentInterface[],
		{ maxHeight, maxWidth }: CarousalContainerSpecificationType,
	) {
		if (!items) return;
		let MIN_HEIGHT = 0;
		try {
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
					maxW: maxWidth,
					maxH: maxHeight,
					H: seedHeight,
					W: seedWidth,
				});
				MIN_HEIGHT = Math.max(MIN_HEIGHT, height);
			}
		} catch (e) {
			console.error(
				'[ERROR]: calculating estimated height for media attachments',
				e,
				items,
			);
		}
		return MIN_HEIGHT;
	}
}

export default MediaService;
