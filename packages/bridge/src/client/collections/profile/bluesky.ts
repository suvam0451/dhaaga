import { ProfileRoute } from './_interface.js';
import { LibraryPromise } from '#/types/index.js';

class BlueskyProfileRouter implements ProfileRoute {
	followRequests(): LibraryPromise<any> {
		throw new Error('Method not implemented.');
	}
}

export default BlueskyProfileRouter;
