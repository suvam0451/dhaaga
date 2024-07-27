import { LibraryResponse } from './_types.js';
import { mastodon } from 'masto';
import { LibraryPromise } from './routes/_types.js';

export enum KNOWN_SOFTWARE {
	AKKOMA = 'akkoma',
	CHERRYPICK = 'cherrypick',
	FIREFISH = 'firefish',
	FRIENDICA = 'friendica',
	GOTOSOCIAL = 'gotosocial',
	HOMETOWN = 'hometown',
	ICESHRIMP = 'iceshrimp',
	// smol fork
	KMYBLUE = 'kmyblue',
	LEMMY = 'lemmy',

	MASTODON = 'mastodon',
	MEISSKEY = 'meisskey',
	MISSKEY = 'misskey',

	PEERTUBE = 'peertube',
	PIXELFED = 'pixelfed',
	PLEROMA = 'pleroma',
	SHARKEY = 'sharkey',

	// software could not be detected
	UNKNOWN = 'unknown',
}

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
			uuid: string;
		},
	): LibraryPromise<{
		software: string;
		version?: string | null;
		loginUrl: string;
		loginStrategy: 'code' | 'miauth';
	}>;
}
