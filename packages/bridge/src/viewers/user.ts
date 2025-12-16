import { UserObjectType } from '#/types/index.js';

class Viewer {
	static hasDescriptionText(input: UserObjectType) {
		return !!input.description;
	}
}

export { Viewer as UserViewer };
