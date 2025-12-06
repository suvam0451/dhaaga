import { InstanceRoute } from './_interface.js';
import { CustomEmojiObject } from '#/types/shared/reactions.js';

export class BlueskyInstanceRouter implements InstanceRoute {
	getTranslation(id: string, lang: string): Promise<any> {
		throw new Error('Method not implemented.');
	}

	async getCustomEmojis(urlLike: string): Promise<CustomEmojiObject[]> {
		return [];
	}
}
