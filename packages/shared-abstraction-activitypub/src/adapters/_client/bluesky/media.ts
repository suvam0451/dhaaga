import { LibraryPromise } from '../_router/routes/_types.js';
import { DhaagaJsMediaCreateDTO, MediaRoute } from '../_router/routes/media.js';

class BlueskyMediaRouter implements MediaRoute {
	create(dto: DhaagaJsMediaCreateDTO): LibraryPromise<any> {
		throw new Error('Method not implemented.');
	}
	updateDescription(id: string, text: string): LibraryPromise<any> {
		throw new Error('Method not implemented.');
	}
}

export default BlueskyMediaRouter;
