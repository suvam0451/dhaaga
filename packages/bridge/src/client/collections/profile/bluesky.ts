import { ProfileRoute } from './_interface.js';

class BlueskyProfileRouter implements ProfileRoute {
	followRequests(): Promise<any> {
		throw new Error('Method not implemented.');
	}
}

export default BlueskyProfileRouter;
