import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AppResultPageType } from '../types/app.types';
import { PostParser, UserParser, RandomUtil } from '@dhaaga/core';
import type { NotificationObjectType } from '@dhaaga/core';

export class MisskeyService {
	/**
	 * Translates misskey notification objects
	 * for usage throughout the app
	 * @param data make sure to pass correct object
	 * @param driver misskey compatible driver
	 * @param server your home server
	 *
	 * NOTE: converts 'specified' visibility to
	 * 'chat'
	 */
	static packNotifs(
		data: any,
		driver: KNOWN_SOFTWARE,
		server: string,
	): AppResultPageType<NotificationObjectType> {
		return {
			success: true,
			items: data.data
				.map((o: any) => {
					try {
						if (['achievementEarned', 'note:grouped'].includes(o.type)) {
							return null;
						}

						const _postTarget = !!o.note ? o.note : o;

						const _acct = !['login'].includes(o.type)
							? UserParser.parse<unknown>(o.user, driver, server)
							: null;
						// cherrypick fixes
						const _post =
							_postTarget &&
							!['login', 'follow', 'followRequestAccepted'].includes(o.type)
								? PostParser.parse<unknown>(_postTarget, driver, server)
								: null;

						const _obj: NotificationObjectType = {
							id: RandomUtil.nanoId(),
							type:
								o.type ||
								(_post.visibility === 'specified' ? 'chat' : _post.visibility),
							post: _post,
							user: _acct,
							read: false,
							createdAt: new Date(o.createdAt || _post.createdAt),
							extraData: {},
						};
						return _obj;
					} catch (e) {
						console.log('[WARN]: failed to resolve notification', e);
						return null;
					}
				})
				.filter((o) => !!o),
			minId: null,
			maxId: data.data[data.data.length - 1].id,
		};
	}
}
