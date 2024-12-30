import { LibraryPromise } from '../_router/routes/_types.js';
import { ProfileRoute } from '../_router/routes/profile.js';

class BlueskyProfileRouter implements ProfileRoute {
	followRequests(): LibraryPromise<any> {
		throw new Error('Method not implemented.');
	}
}

export default BlueskyProfileRouter;
