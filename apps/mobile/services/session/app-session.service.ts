import { BaseStorageManager } from './_shared';
import { z } from 'zod';
import { DataSource } from '../../database/dataSource';
import { AppUserObject } from '../../types/app-user.types';

enum APP_CACHE_KEY {
	LINK_TARGET = 'app/_cache/bottomSheet_linkTarget',
	TAG_TARGET = 'app/_cache/bottomSheet_tagTarget',
	USER_ID_TARGET = 'app/_cache/bottomSheet_userId',
	USER_OBJECT_TARGET = 'app/_cache/bottomSheet_userObject',
	SERVER_CLIENT_TOKEN_TARGET = 'app/_cache/apProto/serverClientToken/:server',
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

	getUserObject(): AppUserObject {
		return this.getJson<AppUserObject>(APP_CACHE_KEY.USER_OBJECT_TARGET);
	}

	setUserObject(obj: AppUserObject) {
		return this.setJson(APP_CACHE_KEY.USER_OBJECT_TARGET, obj);
	}

	/**
	 * Need to store per server, because frequent app
	 * registration results in hour long rate limits
	 */

	getAtprotoServerClientTokens(server: string) {
		return this.getJson<AppAtprotoServerClientTokenType>(
			APP_CACHE_KEY.SERVER_CLIENT_TOKEN_TARGET.toString().replace(
				'{:server}',
				server,
			),
		);
	}

	setAtprotoServerClientTokens(
		server: string,
		clientId: string,
		clientSecret: string,
	) {
		this.setJson(
			APP_CACHE_KEY.SERVER_CLIENT_TOKEN_TARGET.toString().replace(
				'{:server}',
				server,
			),
			{ clientId, clientSecret },
		);
	}
}

class AppSessionManager {
	db: DataSource;
	cache: Storage;

	constructor(db: DataSource) {
		this.db = db;
		this.cache = new Storage();
	}
}

export default AppSessionManager;
