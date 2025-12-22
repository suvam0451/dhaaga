import { z } from 'zod';
import type { PostObjectType, UserObjectType } from '@dhaaga/bridge';
import { DataSource } from '@dhaaga/db';
import { BaseStorageManager } from './_shared';
import { ViewMeasurement } from '#/utils/viewport.utils';

enum APP_CACHE_KEY {
	// bottom sheets
	LINK_TARGET = 'app/_cache/bottomSheet_linkTarget',
	TAG_TARGET = 'app/_cache/bottomSheet_tagTarget',
	USER_ID_TARGET = 'app/_cache/bottomSheet_userId',
	POST_OBJECT_TARGET = 'app/_cache/bottomSheet_postObject',
	USER_OBJECT_TARGET = 'app/_cache/bottomSheet_userObject',
	SERVER_CLIENT_TOKEN_TARGET = 'app/_cache/apProto/serverClientToken/:server', // modals
	MEDIA_INSPECT_POST_TARGET = 'app/_cache/modal_mediaInspectPostObject',
	USER_COMPONENT_PEEK_TARGET = 'app/_cache/modal_userComponentPeekObject',
	BOTTOM_SHEET_MORE_ACTION_POST_TARGET = 'app/_cache/bottomSheet_moreActions_postObject',
	APP_SKIN_TARGET = 'app/_cache/appSkin',
}

/**
 * ---- Typings ----
 */

const AppAtprotoServerClientTokenDto = z.object({
	clientId: z.string(),
	clientSecret: z.string(),
});

type AppAtprotoServerClientTokenType = z.infer<
	typeof AppAtprotoServerClientTokenDto
>;

const userPeekModalDataSchema = z.object({
	measurement: z.object({
		x: z.number(),
		y: z.number(),
		width: z.number(),
		height: z.number(),
	}),
	userId: z.string(),
});

export type UserPeekModalDataType = z.infer<typeof userPeekModalDataSchema>;

type AppSkinObjectType = {
	id: string;
	useWallpaper: boolean;
	useIconPack: boolean;
	useTransparency: boolean;
};

/**
 * ---- Storage Interfaces ----
 */

const searchHistoryItemSchema = z.object({
	searchTerm: z.string(),
	frequency: z.number().default(0),
	resultCount: z.number().default(0),
});

export type SearchHistoryItemType = z.infer<typeof searchHistoryItemSchema>;

class Storage extends BaseStorageManager {
	getUserId() {
		return this.get(APP_CACHE_KEY.USER_ID_TARGET);
	}

	setUserId(value: string) {
		return this.set(APP_CACHE_KEY.USER_ID_TARGET, value);
	}

	getUserObject(): UserObjectType {
		return this.getJson<UserObjectType>(APP_CACHE_KEY.USER_OBJECT_TARGET);
	}

	setUserObject(obj: UserObjectType) {
		return this.setJson(APP_CACHE_KEY.USER_OBJECT_TARGET, obj);
	}

	setPostForMediaInspect(obj: UserObjectType) {
		return this.setJson(APP_CACHE_KEY.MEDIA_INSPECT_POST_TARGET, obj);
	}

	getPostForMediaInspect() {
		return this.getJson<PostObjectType>(
			APP_CACHE_KEY.MEDIA_INSPECT_POST_TARGET,
		);
	}

	/**
	 * Need to store per server, because frequent app
	 * registration results in hour long rate limits
	 */

	getAtprotoServerClientTokens(
		server: string,
	): AppAtprotoServerClientTokenType | null {
		// Get the current date and time
		const sixHoursBefore = new Date();
		sixHoursBefore.setHours(sixHoursBefore.getHours() - 6);

		return this.getJsonWithExpiry<AppAtprotoServerClientTokenType>(
			APP_CACHE_KEY.SERVER_CLIENT_TOKEN_TARGET.toString().replace(
				':server',
				server,
			),
			sixHoursBefore,
		);
	}

	setAtprotoServerClientTokens(
		server: string,
		clientId: string,
		clientSecret: string,
	) {
		this.setJsonWithExpiry(
			APP_CACHE_KEY.SERVER_CLIENT_TOKEN_TARGET.toString().replace(
				':server',
				server,
			),
			{
				clientId,
				clientSecret,
			},
		);
	}

	getUserPeekModalData(): UserPeekModalDataType {
		return this.getJson<UserPeekModalDataType>(
			APP_CACHE_KEY.USER_COMPONENT_PEEK_TARGET,
		);
	}

	setUserPeekModalData(userId: string, measurement: ViewMeasurement) {
		this.setJson(APP_CACHE_KEY.USER_COMPONENT_PEEK_TARGET, {
			userId,
			measurement,
		});
	}

	/**
	 * App Skin
	 */

	getAppSkin(): AppSkinObjectType {
		return (
			this.getJson<AppSkinObjectType>(APP_CACHE_KEY.APP_SKIN_TARGET) ?? {
				id: 'default',
				useWallpaper: false,
				useIconPack: false,
				useTransparency: false,
			}
		);
	}

	setAppSkin(item: AppSkinObjectType) {
		return this.setJson(APP_CACHE_KEY.APP_SKIN_TARGET, item);
	}
}

class AppSessionManager {
	db: DataSource;
	storage: Storage;

	constructor(db: DataSource) {
		this.db = db;
		this.storage = new Storage();
	}
}

export default AppSessionManager;
