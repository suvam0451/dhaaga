import { PostMentionObjectType, PostObjectType } from '#/types/index.js';
import { ApiTargetInterface } from '#/client/index.js';
import { DriverService } from '#/services/driver.js';
import { PostInspector } from '#/parsers/index.js';
import { DriverUserFindQueryType } from '#/types/query.types.js';

class Viewer {
	static generateShareableLink(
		client: ApiTargetInterface,
		post: PostObjectType,
	): string | null {
		const _uri = post.id;
		const _handle = PostInspector.getContentTarget(post).postedBy.handle;

		console.log(_uri, _handle);
		if (DriverService.supportsAtProto(client.driver)) {
			if (!_uri?.startsWith('at://')) return null;

			// Strip scheme
			const withoutScheme = _uri.slice(5);

			// Expected: <repo>/app.bsky.feed.post/<postId>
			const [repo, , postId] = withoutScheme.split('/');

			console.log(withoutScheme, withoutScheme.split('/'), repo, postId);

			if (!postId) return null;

			// handle, or pds repo as backup
			const profile =
				_handle && _handle.trim() ? _handle.replace(/^@/, '') : repo;

			return `https://bsky.app/profile/${profile}/post/${postId}`;
		} else if (DriverService.supportsMisskeyApi(client.driver)) {
			return `https://${client.server!}/notes/${post.id}`;
		} else if (DriverService.supportsPleromaApi(client.driver)) {
			return `https://${client.server!}/notice/${post.id}`;
		} else if (DriverService.supportsMastoApiV2(client.driver)) {
			return `https://${client.server!}/${_handle}/${post.id}`;
		} else {
			throw new Error('Post uri resolution not handled for API call');
		}
	}

	static mentionItemsToWebfinger(
		handle: string,
		items: PostMentionObjectType[],
	): DriverUserFindQueryType | null {
		const parts = handle.split('@').filter(Boolean); // Remove empty elements after splitting
		if (parts.length === 1) {
			/**
			 * Mastodon has acct/url
			 */
			const match = items.find(
				(o) => o.acct?.startsWith(parts[0]) && o.url?.endsWith(parts[0]),
			);
			if (match) {
				return {
					use: 'userId',
					userId: match.id,
				};
			}
		}
		const match = items.find((o) => o.acct === `${parts[0]}@${parts[1]}`);
		if (match) {
			return {
				use: 'userId',
				userId: match.id,
			};
		}
		return null;
	}
}

export { Viewer as PostViewer };
