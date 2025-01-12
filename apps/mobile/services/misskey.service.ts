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
			items: data.data.map((o: any) => {
				const _acct = UserMiddleware.deserialize<unknown>(
					o.user,
					driver,
					server,
				);
				const _post = PostMiddleware.deserialize<unknown>(o, driver, server);
				const _obj: AppNotificationObject = {
					id: RandomUtil.nanoId(),
					type: _post.visibility === 'specified' ? 'chat' : _post.visibility,
					post: _post,
					user: _acct,
					read: false,
					createdAt: new Date(_post.createdAt),
					extraData: {},
				};
				return _obj;
			}),
			minId: null,
			maxId: null,
		};
	}
}
