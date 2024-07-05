import { InstanceRoute } from '../_router/instance';
import { DhaagaErrorCode } from '../_router/_types';

export class DefaultInstanceRouter implements InstanceRoute {
	async getTranslation(id: string, lang: string) {
		return {
			error: {
				code: DhaagaErrorCode.DEFAULT_CLIENT,
			},
		};
	}
}
