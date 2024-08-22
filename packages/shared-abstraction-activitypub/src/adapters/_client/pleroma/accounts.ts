import {
	AccountRoute,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
} from '../_router/routes/accounts.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMegalodonClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { KNOWN_SOFTWARE } from '../_router/routes/instance.js';
import {
	errorBuilder,
	notImplementedErrorBuilder,
	successWithData,
} from '../_router/dto/api-responses.dto.js';
import { DefaultAccountRouter } from '../default/accounts.js';
import { LibraryResponse } from '../_router/_types.js';
import {
	GetPostsQueryDTO,
	MastoRelationship,
	MastoStatus,
	MegaAccount,
	MegaStatus,
} from '../_interface.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import AppApi from '../../_api/AppApi.js';

export class PleromaAccountsRouter
	extends DefaultAccountRouter
	implements AccountRoute
{
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MEGALODON>;

	constructor(forwarded: RestClient) {
		super();
		this.client = forwarded;
		this.lib = DhaagaMegalodonClient(
			KNOWN_SOFTWARE.PLEROMA,
			this.client.url,
			this.client.accessToken,
		);
	}

	async lookup(webfingerUrl: string): LibraryPromise<MegaAccount> {
		const data = await this.lib.client.lookupAccount(webfingerUrl);
		if (data.status !== 200) {
			return errorBuilder(data.statusText);
		}
		return { data: data.data };
	}

	async statuses(id: string, query: AccountRouteStatusQueryDto) {
		// this.lib.client.
		return successWithData([]);
	}

	async relationships(
		ids: string[],
	): Promise<LibraryResponse<MastoRelationship[]>> {
		return notImplementedErrorBuilder();
	}

	async likes(opts: GetPostsQueryDTO): LibraryPromise<MegaStatus[]> {
		const data = await this.lib.client.getFavourites(opts);
		if (data.status !== 200) {
			return errorBuilder<MegaStatus[]>(data.statusText);
		}
		return { data: data.data };
	}

	async bookmarks(query: BookmarkGetQueryDTO): LibraryPromise<{
		data: MastoStatus[];
		minId?: string | null;
		maxId?: string | null;
	}> {
		// Works, but not ideal
		// const data = await this.lib.client.getBookmarks(query);
		// return {
		// 	data: {
		// 		data: data.data,
		// 		minId: null,
		// 		maxId: null,
		// 	},
		// };

		const { data: _data, error } = await new AppApi(
			this.client.url,
			this.client.accessToken,
		).getCamelCaseWithLinkPagination<MastoStatus[]>('/api/v1/bookmarks', query);

		if (!_data || error) {
			return notImplementedErrorBuilder<{
				data: MastoStatus[];
				minId: string | null;
				maxId: string | null;
			}>();
		}
		return {
			data: _data,
		};
	}
}
