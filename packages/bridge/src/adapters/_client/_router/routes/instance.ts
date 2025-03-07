import { mastodon } from 'masto';
import { LibraryPromise } from './_types.js';
import { LibraryResponse } from '../../../../types/result.types.js';

export type InstanceApi_SoftwareInfoDTO = {
	software: string;
	version: string | null;
};

export type InstanceApi_CustomEmojiDTO = {
	shortCode: string;
	url: string;
	staticUrl: string;
	visibleInPicker: boolean;
	category?: string | null;
	aliases: string[];
	tags: string[];
};

export type MastoTranslation = mastodon.v1.Translation;

export interface InstanceRoute {
	getTranslation(
		id: string,
		lang: string,
	): Promise<LibraryResponse<MastoTranslation>>;

	getSoftwareInfo(
		urlLike: string,
		software?: string,
	): Promise<LibraryResponse<InstanceApi_SoftwareInfoDTO>>;

	getCustomEmojis(
		urlLike: string,
	): Promise<LibraryResponse<InstanceApi_CustomEmojiDTO[]>>;

	/**
	 *
	 * @param urlLike
	 */
	getLoginUrl(
		urlLike: string,
		{}: {
			appName: string;
			appCallback: string;
			appClientId: string;
			appClientSecret: string;
			uuid: string;
		},
	): LibraryPromise<{
		software: string;
		version?: string | null;
		loginUrl: string;
		loginStrategy: 'code' | 'miauth';
	}>;
}
