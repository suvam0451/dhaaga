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

		let _H = H;
		let _W = W;

		if (H > W) {
			_H = maxH;
			_W = (_H / H) * W;

			if (_W > maxW) {
				_W = maxW;
				_H = (maxW / W) * H;
			}
			return {
				width: _W,
				height: _H,
			};
		} else {
			_W = maxW;
			_H = (_W / W) * H;

			if (_H > maxH) {
				_H = maxH;
				_W = (maxH / H) * W;
			}
			return {
				width: _W,
				height: _H,
			};
		}
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
			const seedWidth = item.getWidth();
			const seedHeight = item.getHeight();

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
