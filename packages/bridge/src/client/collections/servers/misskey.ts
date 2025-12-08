import { InstanceRoute } from './_interface.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MisskeyJsWrapper } from '#/client/utils/api-wrappers.js';
import { identifyBackendSoftware } from '#/client/utils/detect-software.js';
import { CustomEmojiObjectType } from '#/types/shared/reactions.js';
import { MastoTranslation } from '#/types/index.js';

export class MisskeyInstanceRouter implements InstanceRoute {
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async getCustomEmojis(urlLike: string): Promise<CustomEmojiObjectType[]> {
		throw new Error('Method not implemented.');
	}

	async getSoftwareInfo(urlLike: string) {
		return await identifyBackendSoftware(urlLike);
	}

	async getTranslation(id: string, lang: string): Promise<MastoTranslation> {
		throw new Error('method not implemented');
	}
}
