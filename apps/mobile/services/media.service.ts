import { MediaAttachmentInterface } from '@dhaaga/shared-abstraction-activitypub';
import { ActivityPubMediaAttachment } from '../entities/activitypub-media-attachment.entity';

class MediaService {
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
			const meta = item.getMeta();

			const width = item.getWidth();
			const height = item.getHeight();

			if (height && height > MIN_HEIGHT) {
				const multiplier = deviceWidth / width;
				MIN_HEIGHT = Math.min(height * multiplier, maxHeight);
			}
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
