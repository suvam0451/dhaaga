import {
	Account,
	ACCOUNT_METADATA_KEY,
	AccountService,
	DataSource,
} from '@dhaaga/db';
import { KNOWN_SOFTWARE, RandomUtil } from '@dhaaga/bridge';
import { type AtpSessionData, type AppBskyActorGetProfile } from '@atproto/api';

class AccountDbService {
	static upsertAccountCredentials(
		db: DataSource,
		accessToken: string,
		_subdomain: string,
		_domain: string,
		userData: any,
	): Account {
		return AccountService.upsert(
			db,
			{
				uuid: RandomUtil.nanoId(),
				identifier: userData.id,
				server: _subdomain,
				driver: _domain,
				username: userData.username,
				avatarUrl: userData.avatar, // TODO: this needs to be replaced with camelCase
				displayName: userData['display_name'],
			},
			[
				{
					key: ACCOUNT_METADATA_KEY.DISPLAY_NAME,
					value: userData['display_name'],
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.AVATAR_URL,
					value: userData['avatar'],
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.USER_IDENTIFIER,
					value: userData.id,
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.ACCESS_TOKEN,
					value: accessToken,
					type: 'string',
				},
				{ key: 'url', value: userData.url, type: 'string' },
			],
		);
	}

	static upsertAccountCredentials_miAuth(
		db: DataSource,
		code: string,
		_subdomain: string,
		_domain: string,
		userData: {
			id: string;
			displayName: string;
			username: string;
			avatar: string;
		},
	) {
		const { id, displayName, username, avatar } = userData;
		return AccountService.upsert(
			db,
			{
				uuid: RandomUtil.nanoId(),
				identifier: id,
				server: _subdomain,
				driver: _domain,
				username: username,
				avatarUrl: avatar,
				displayName: displayName,
			},
			[
				{
					key: ACCOUNT_METADATA_KEY.DISPLAY_NAME,
					value: displayName,
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.AVATAR_URL,
					value: avatar,
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.USER_IDENTIFIER,
					value: id,
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.ACCESS_TOKEN,
					value: code,
					type: 'string',
				},
			],
		);
	}

	static upsertAccountCredentials_AtProto(
		db: DataSource,
		password: string,
		sessionObject: AtpSessionData,
		profileData: AppBskyActorGetProfile.Response,
	) {
		const accessToken = sessionObject.accessJwt;
		const refreshToken = sessionObject.refreshJwt;
		const instance = 'bsky.social';
		const avatarUrl = profileData.data.avatar!;
		const displayName = profileData.data.displayName!;
		const _username = profileData.data.handle;
		const did = profileData.data.did;

		return AccountService.upsert(
			db,
			{
				uuid: RandomUtil.nanoId(),
				identifier: profileData.data.did,
				server: instance,
				driver: KNOWN_SOFTWARE.BLUESKY,
				username: _username,
				avatarUrl,
				displayName,
			},
			[
				{
					key: ACCOUNT_METADATA_KEY.DISPLAY_NAME,
					value: displayName,
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.AVATAR_URL,
					value: avatarUrl,
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.ACCESS_TOKEN,
					value: accessToken,
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.REFRESH_TOKEN,
					value: refreshToken,
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.ATPROTO_DID,
					value: did,
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.ATPROTO_APP_PASSWORD,
					value: password,
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.ATPROTO_SESSION,
					value: JSON.stringify(sessionObject),
					type: 'json',
				},
			],
		);
	}
}

export default AccountDbService;
