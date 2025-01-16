import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { UserMiddleware } from './middlewares/user.middleware';
import { PostMiddleware } from './middlewares/post.middleware';
import { AppNotificationObject } from '../types/app-notification.types';
import { RandomUtil } from '../utils/random.utils';
import { AppResultPageType } from '../types/app.types';

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
	static deserializeNotifications(
		data: any,
		driver: KNOWN_SOFTWARE,
		server: string,
	): AppResultPageType<AppNotificationObject> {
		return {
			success: true,
			items: data.data
				.map((o: any) => {
					try {
						if (['achievementEarned'].includes(o.type)) {
							return null;
						}

						const _postTarget = !!o.note ? o.note : o;

						const _acct = !['login'].includes(o.type)
							? UserMiddleware.deserialize<unknown>(o.user, driver, server)
							: null;
						// cherrypick fixes
						const _post =
							_postTarget &&
							!['login', 'follow', 'followRequestAccepted'].includes(o.type)
								? PostMiddleware.deserialize<unknown>(
										_postTarget,
										driver,
										server,
									)
								: null;

						const _obj: AppNotificationObject = {
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
			maxId: null,
		};
	}
}
