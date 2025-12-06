import { LibraryPromise } from '#/adapters/_client/_router/routes/_types.js';
import { ProfileRoute } from './_interface.js';

class BlueskyProfileRouter implements ProfileRoute {
	followRequests(): LibraryPromise<any> {
		throw new Error('Method not implemented.');
	}
}

export default BlueskyProfileRouter;
