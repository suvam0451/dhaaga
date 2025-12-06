import { CustomEmojiObject } from '#/types/shared/reactions.js';
import { MastoTranslation } from '#/types/index.js';

export interface InstanceRoute {
	getTranslation(id: string, lang: string): Promise<MastoTranslation>;

	getCustomEmojis(urlLike: string): Promise<CustomEmojiObject[]>;
}
