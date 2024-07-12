import { TrendsRoute } from '../_router/routes/trends.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';

export class DefaultTrendsRouter implements TrendsRoute {
	async tags() {
		return notImplementedErrorBuilder();
	}

	async posts() {
		return notImplementedErrorBuilder();
	}

	async links() {
		return notImplementedErrorBuilder();
	}
}
