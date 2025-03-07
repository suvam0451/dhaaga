import { BaseStorageManager } from './_shared';
import { z } from 'zod';
import { DataSource } from '@dhaaga/db';
import type { PostObjectType, UserObjectType } from '@dhaaga/bridge';
import { ViewMeasurement } from '../../utils/viewport.utils';

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
}

/**
 * ---- Typings ----
 */

const AppLinkTargetDto = z.object({
	url: z.string(),
	displayName: z.string().optional().nullable(),
});

type AppLinkTargetType = z.infer<typeof AppLinkTargetDto>;

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

/**
 * ---- Storage Interfaces ----
 */

class Storage extends BaseStorageManager {
	getLinkTarget(): AppLinkTargetType {
		return this.getJson(APP_CACHE_KEY.LINK_TARGET);
	}

	setLinkTarget(url: string, displayName: string) {
		this.setJson(APP_CACHE_KEY.LINK_TARGET, {
			url,
			displayName,
		});
	}

	getTagTarget() {
		return this.get(APP_CACHE_KEY.TAG_TARGET);
	}

	setTagTarget(value: string) {
		return this.set(APP_CACHE_KEY.TAG_TARGET, value);
	}

	getUserId() {
		return this.get(APP_CACHE_KEY.USER_ID_TARGET);
	}

	setUserId(value: string) {
		return this.set(APP_CACHE_KEY.USER_ID_TARGET, value);
	}

	getBottomSheetPostActionsTarget(): PostObjectType {
		return this.getJson<PostObjectType>(
			APP_CACHE_KEY.BOTTOM_SHEET_MORE_ACTION_POST_TARGET,
		);
	}

	setBottomSheetPostActionsTarget(input: PostObjectType) {
		return this.setJson(
			APP_CACHE_KEY.BOTTOM_SHEET_MORE_ACTION_POST_TARGET,
			input,
		);
	}

	getPostObject(): PostObjectType {
		return this.getJson<PostObjectType>(APP_CACHE_KEY.POST_OBJECT_TARGET);
	}

	setPostObject(target: PostObjectType) {
		return this.setJson(APP_CACHE_KEY.POST_OBJECT_TARGET, target);
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

	getAtprotoServerClientTokens(server: string) {
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
