import { ACCOUNT_METADATA_KEY, AccountService, DataSource } from '@dhaaga/db';
import { RandomUtil } from '@dhaaga/bridge';

class AccountDbService {
	static upsertAccountCredentials(
		db: DataSource,
		code: string,
		_subdomain: string,
		_domain: string,
		userData: any,
	) {
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
					value: code,
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
}

export default AccountDbService;
