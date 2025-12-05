import { DhaagaJsMediaCreateDTO, MediaRoute } from './_interface.js';

class BlueskyMediaRouter implements MediaRoute {
	create(dto: DhaagaJsMediaCreateDTO): Promise<any> {
		throw new Error('Method not implemented.');
	}
	updateDescription(id: string, text: string): Promise<any> {
		throw new Error('Method not implemented.');
	}
}

export default BlueskyMediaRouter;
