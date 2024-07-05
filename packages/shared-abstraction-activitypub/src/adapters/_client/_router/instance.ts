import type { mastodon } from 'masto';
import { LibraryResponse } from './_types';

export enum KNOWN_SOFTWARE {
	MASTODON = 'mastodon',
	MISSKEY = 'misskey',
	PLEROMA = 'pleroma',
	AKKOMA = 'akkoma',
	FRIENDICA = 'friendica',
	FIREFISH = 'firefish',
	GOTOSOCIAL = 'gotosocial',
	LEMMY = 'lemmy',
	PEERTUBE = 'peertube',
	PIXELFED = 'pixelfed',
	SHARKEY = 'sharkey',
	HOMETOWN = 'hometown',
	CHERRYPICK = 'cherrypick',
	ICESHRIMP = 'iceshrimp',
	MEISSKEY = 'meisskey',
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
};

export interface InstanceRoute {
	getTranslation(
		id: string,
		lang: string,
	): Promise<LibraryResponse<mastodon.v1.Translation>>;

	getSoftwareInfo(
		urlLike: string,
	): Promise<LibraryResponse<InstanceApi_SoftwareInfoDTO>>;

	getCustomEmojis(
		urlLike: string,
	): Promise<LibraryResponse<InstanceApi_CustomEmojiDTO[]>>;
}
