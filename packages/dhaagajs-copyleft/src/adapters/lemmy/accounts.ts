import { BlockPersonResponse, LemmyHttp } from 'lemmy-js-client';
import {
	AccountMutePostDto,
	AccountRoute,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	LibraryResponse,
	LibraryPromise,
	errorBuilder,
	GetPostsQueryDTO,
	MastoAccount,
	MastoList,
	MastoStatus,
	MegaStatus,
	MissUserDetailed,
	BaseAccountsRouter,
} from '@dhaaga/shared-abstraction-activitypub';

export class LemmyAccountsRouter
	extends BaseAccountsRouter
	implements AccountRoute
{
	client: LemmyHttp;

	constructor(client: LemmyHttp) {
		super();
		this.client = client;
	}

	async get(username: string): Promise<any> {
		try {
			const data = await this.client.getPersonDetails({
				username,
			});
			return { data };
		} catch (e) {
			return errorBuilder();
		}
	}

	override async block(id: string): LibraryPromise<BlockPersonResponse> {
		try {
			const _id = parseInt(id);
			const data = await this.client.blockPerson({
				person_id: _id,
				block: true,
			});
			return { data };
		} catch (e) {
			return errorBuilder();
		}
	}

	async bookmarks(query: BookmarkGetQueryDTO): Promise<
		LibraryResponse<{
			data: any;
			minId?: string | null;
			maxId?: string | null;
		}>
	> {
		return errorBuilder();
	}

	getMany(ids: string[]): LibraryPromise<MastoAccount[] | MissUserDetailed[]> {
		return Promise.resolve(undefined);
	}

	likes(opts: GetPostsQueryDTO): LibraryPromise<MastoStatus[] | MegaStatus[]> {
		return Promise.resolve(undefined);
	}

	lists(id: string): LibraryPromise<MastoList[]> {
		return Promise.resolve([]);
	}

	lookup(webfingerUrl: string): LibraryPromise<any> {
		return Promise.resolve(undefined);
	}

	mute(id: string, opts: AccountMutePostDto): LibraryPromise<any> {
		return Promise.resolve(undefined);
	}

	relationships(ids: string[]): LibraryPromise<any[]> {
		return Promise.resolve(undefined);
	}

	removeFollower(id: string): LibraryPromise<void> {
		return Promise.resolve(undefined);
	}

	statuses(
		id: string,
		params: AccountRouteStatusQueryDto,
	): LibraryPromise<any> {
		return Promise.resolve(undefined);
	}

	unblock(id: string): LibraryPromise<any> {
		return Promise.resolve(undefined);
	}

	unfollow(id: string): LibraryPromise<any> {
		return Promise.resolve(undefined);
	}

	unmute(id: string): LibraryPromise<any> {
		return Promise.resolve(undefined);
	}
}
