import ActivityPubClient, { RestClientCreateDTO } from '../_interface';
import { RestClient } from '@dhaaga/shared-provider-mastodon/src';
import { MastodonInstanceRouter } from '../mastodon/instance';
import { PleromaInstanceRouter } from './instance';
import { COMPAT, DhaagaPleromaClient } from '../_router/_runner';
import { MegalodonInterface } from 'megalodon';

class PleromaRestClient implements ActivityPubClient {
	client: RestClient;
	instance: PleromaInstanceRouter;

	constructor(dto: RestClientCreateDTO) {
		this.client = new RestClient(dto.instance, {
			accessToken: dto.token,
			domain: 'mastodon',
		});
		this.instance = new PleromaInstanceRouter(this.client);
	}
}

export default PleromaRestClient;
