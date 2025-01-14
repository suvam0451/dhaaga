import {
	ActivitypubStatusAdapter,
	StatusInterface,
	UserInterface,
} from '@dhaaga/bridge';
import activitypubAdapterService from '../activitypub-adapter.service';
import {
	AppPostObject,
	AppStatusDtoService,
	ActivityPubStatusItemDto,
	appPostObjectSchema,
} from '../../types/app-post.types';
import ActivitypubAdapterService from '../activitypub-adapter.service';
import { z } from 'zod';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import AppPrivacySettingsService from '../app-settings/app-settings-privacy.service';
import { SQLiteDatabase } from 'expo-sqlite';
import { AccountSavedPost } from '../../database/_schema';
import { DataSource } from '../../database/dataSource';

/**
 * converts unified interfaces into
 * light-weight JSON objects, to be
 * consumed by the app
 *
 * This middleware deals with post
 * objects. Also see other files
 * in this folder
 */
export class PostMiddleware {
	domain: string;
	subdomain: string;
	statusI: StatusInterface;
	userI: UserInterface;
	/**
	 * list of instances found
	 * can belong to current/parent/boosted status
	 * and associated users
	 */
	foundInstances: Set<string>;

	constructor(ref: StatusInterface, driver: string, server: string) {
		this.statusI = ref;
		this.domain = driver;
		this.subdomain = server;
		this.foundInstances = new Set();
		return this;
	}

	/**
	 * Find a list of instances associated
	 * wit this status
	 */
	resolveInstances() {
		const _user = activitypubAdapterService.adaptUser(
			this.statusI.getUser(),
			this.domain,
		);
		const _subdomain = _user.getInstanceUrl(this.subdomain);
		this.foundInstances.add(_subdomain);

		// handle boosted content
		if (this.statusI.isReposted()) {
			const _userR = activitypubAdapterService.adaptUser(
				this.statusI.getRepostedStatus()?.getUser(),
				this.domain,
			);
			const _subdomain = _userR.getInstanceUrl();
			this.foundInstances.add(_subdomain);
		}
		return this;
	}

	async syncSoftware(db: SQLiteDatabase) {
		if (
			AppPrivacySettingsService.create(
				db,
			).isDisabledCrossInstanceSoftwareCaching()
		) {
			return this;
		}

		// const promises = Array.from(this.foundInstances).map((o) => {
		// 	return ProfileKnownServerService.syncDriver(db, o);
		// });
		// await Promise.all(promises);
		return this;
	}

	// Static method that returns an instance of MyClass
	static factory(ref: StatusInterface, domain?: string, subdomain?: string) {
		return new PostMiddleware(ref, domain, subdomain);
	}

	export(): AppPostObject {
		// console.log('step 1/4');
		// to prevent infinite recursion
		if (!this.statusI || !this.statusI.getId()) return null;

		const IS_REPOSTED = this.statusI.isReposted();
		const IS_REPLY = this.statusI.isReply();

		let boostedFrom: z.infer<typeof ActivityPubStatusItemDto> = IS_REPOSTED
			? new PostMiddleware(
					ActivitypubAdapterService.adaptStatus(
						this.statusI.getRepostedStatusRaw(),
						this.domain,
					),
					this.domain,
					this.subdomain,
				).export()
			: null;
		// console.log('step 2/4');

		/**
		 * Misskey Compat
		 *
		 * NOTE: For mastodon, we need to show reply
		 * but not render the status
		 */
		let replyTo: z.infer<typeof ActivityPubStatusItemDto> =
			IS_REPLY && this.statusI.getParentRaw()
				? new PostMiddleware(
						ActivitypubAdapterService.adaptStatus(
							this.statusI.getParentRaw(),
							this.domain,
						),
						this.domain,
						this.subdomain,
					).export()
				: null;
		// console.log('step 3/4');

		let rootI: z.infer<typeof ActivityPubStatusItemDto> =
			this.statusI.hasRootAvailable()
				? new PostMiddleware(
						ActivitypubAdapterService.adaptStatus(
							this.statusI.getRootRaw(),
							this.domain,
						),
						this.domain,
						this.subdomain,
					).export()
				: null;
		// console.log('step 4/4');

		const dto: AppPostObject =
			IS_REPLY &&
			[
				KNOWN_SOFTWARE.MISSKEY,
				KNOWN_SOFTWARE.FIREFISH,
				KNOWN_SOFTWARE.SHARKEY,
				KNOWN_SOFTWARE.BLUESKY,
			].includes(this.domain as any) /**
			 * 	Replies in Misskey is actually present in the
			 * 	"reply" object, instead of root. へんですね?
			 */
				? {
						...AppStatusDtoService.export(
							this.statusI,
							this.domain,
							this.subdomain,
						),
						boostedFrom,
						replyTo,
						rootPost: rootI,
					}
				: {
						...AppStatusDtoService.export(
							this.statusI,
							this.domain,
							this.subdomain,
						),
						boostedFrom,
					};

		const { data, error, success } = appPostObjectSchema.safeParse(dto);
		if (!success) {
			console.log('[ERROR]: status item dto validation failed', error);
			console.log('[INFO]: generated object', dto);
			this.statusI.print();
			return null;
		}

		return data as AppPostObject;
	}

	/**
	 * Converts a savedPost (post saved locally
	 * on the database) to in-app dto object
	 *
	 * Notably, no need to look for
	 * shares/parents/root/quotes/embeds
	 * @param db
	 * @param input
	 * @param driver
	 * @param server
	 */
	static databaseToJson(
		db: DataSource,
		input: AccountSavedPost,
		{
			driver,
			server,
		}: {
			driver: KNOWN_SOFTWARE | string;
			server: string;
		},
	): AppPostObject {
		const parsed = AppStatusDtoService.exportLocal(db, input, driver, server);

		const { data, error, success } = appPostObjectSchema.safeParse(parsed);
		if (!success) {
			console.log('[ERROR]: failed to convert local savedPost', error);
			console.log('[INFO]: input used', input);
			return null;
		}
		return data as AppPostObject;
	}

	static interfaceToJson(
		input: StatusInterface,
		{
			driver,
			server,
		}: {
			driver: KNOWN_SOFTWARE | string;
			server: string;
		},
	): AppPostObject {
		// prevent infinite recursion
		if (!input) return null;

		const IS_SHARE = input.isReposted();
		const HAS_PARENT = input.isReply();
		const HAS_ROOT = input.hasRootAvailable();

		if (IS_SHARE) {
			console.log('repost object', input.getRepostedStatusRaw());
		}
		let sharedFrom: z.infer<typeof ActivityPubStatusItemDto> = IS_SHARE
			? PostMiddleware.deserialize(input.getRepostedStatusRaw(), driver, server)
			: null;

		// Null for Mastodon
		let replyTo: z.infer<typeof ActivityPubStatusItemDto> = HAS_PARENT
			? PostMiddleware.deserialize(input.getParentRaw(), driver, server)
			: null;

		let root: z.infer<typeof ActivityPubStatusItemDto> = HAS_ROOT
			? PostMiddleware.deserialize(input.getRootRaw(), driver, server)
			: null;

		const dto: AppPostObject =
			HAS_PARENT &&
			[
				KNOWN_SOFTWARE.MISSKEY,
				KNOWN_SOFTWARE.FIREFISH,
				KNOWN_SOFTWARE.SHARKEY,
				KNOWN_SOFTWARE.BLUESKY,
			].includes(driver as KNOWN_SOFTWARE) /**
			 * 	Replies in Misskey is actually present in the
			 * 	"reply" object, instead of root. へんですね?
			 */
				? {
						...AppStatusDtoService.export(input, driver, server),
						boostedFrom: sharedFrom,
						replyTo,
						rootPost: root,
					}
				: {
						...AppStatusDtoService.export(input, driver, server),
						boostedFrom: sharedFrom,
					};

		const { data, error, success } = appPostObjectSchema.safeParse(dto);
		if (!success) {
			console.log('[ERROR]: status item dto validation failed', error);
			console.log('[INFO]: generated object', dto);
			input.print();
			return null;
		}
		return data as AppPostObject;
	}

	static rawToInterface<T>(
		input: T | T[],
		driver: string | KNOWN_SOFTWARE,
	): T extends unknown[] ? StatusInterface[] : StatusInterface {
		if (Array.isArray(input)) {
			return input
				.filter((o) => !!o)
				.map((o) =>
					ActivitypubStatusAdapter(o, driver),
				) as unknown as T extends unknown[] ? StatusInterface[] : never;
		} else {
			return ActivitypubStatusAdapter(
				input,
				driver,
			) as unknown as T extends unknown[] ? never : StatusInterface;
		}
	}

	/**
	 * Deserializes (skips returning the interface step)
	 * raw ap/at proto post objects
	 * @param input raw ap/at proto post object
	 * @param driver being used to deserialize this object
	 * @param server
	 */
	static deserialize<T>(
		input: T | T[],
		driver: string | KNOWN_SOFTWARE,
		server: string,
	): T extends unknown[] ? AppPostObject[] : AppPostObject {
		if (input instanceof Array) {
			return input
				.map((o) => PostMiddleware.rawToInterface<unknown>(o, driver))
				.filter((o) => !!o)
				.map((o) =>
					PostMiddleware.interfaceToJson(o, {
						driver,
						server,
					}),
				)
				.filter((o) => !!o) as unknown as T extends unknown[]
				? AppPostObject[]
				: never;
		} else {
			try {
				if (!input) return null;
				return PostMiddleware.interfaceToJson(
					PostMiddleware.rawToInterface<unknown>(input, driver),
					{
						driver,
						server,
					},
				) as unknown as T extends unknown[] ? never : AppPostObject;
			} catch (e) {
				console.log(
					'[ERROR]: failed to deserialize post object',
					e,
					'input:',
					input,
				);
				return null;
			}
		}
	}

	/**
	 * Deserializes (skips returning the interface step)
	 * locally saved ap/at proto post objects
	 * @param db database reference
	 * @param input raw ap/at proto post object
	 * @param driver being used to deserialize this object
	 * @param server
	 */
	static deserializeLocal<T>(
		db: DataSource,
		input: T | T[],
		driver: string | KNOWN_SOFTWARE,
		server: string,
	): T extends unknown[] ? AppPostObject[] : AppPostObject {
		if (input instanceof Array) {
			return input
				.map((o) =>
					PostMiddleware.databaseToJson(db, o as AccountSavedPost, {
						driver,
						server,
					}),
				)
				.filter((o) => !!o) as unknown as T extends unknown[]
				? AppPostObject[]
				: never;
		} else {
			try {
				if (!input) return null;
				return PostMiddleware.databaseToJson(db, input as AccountSavedPost, {
					driver,
					server,
				}) as unknown as T extends unknown[] ? never : AppPostObject;
			} catch (e) {
				console.log(
					'[ERROR]: failed to deserialize post object',
					e,
					'input:',
					input,
				);
				return null;
			}
		}
	}

	/**
	 * Since the share item itself
	 * is a protocol object, the underlying
	 * post target with the actual content needs to
	 * be extracted out
	 * @param input post object, possibly the original
	 * root level object
	 *
	 *  - Shares -> Returns boostedFrom
	 *  - Quotes -> Returns the object itself
	 */
	static getContentTarget(input: AppPostObject): AppPostObject {
		if (!input) {
			console.log('[WARN]: trying to obtain target post for', input);
			return input;
		}
		if (input.meta.isBoost && !input.boostedFrom) {
			console.log('[WARN]: original object not available for a repost', input);
			return input;
		}
		return input.meta.isBoost
			? input.content.raw || input.content.media.length > 0
				? input
				: input.boostedFrom
			: input;
	}

	/**
	 * ------ Utility functions follow ------
	 */

	static isQuoteObject(input: AppPostObject) {
		return (
			input?.meta?.isBoost &&
			(input?.content?.raw || input?.content?.media?.length > 0)
		);
	}

	static isLiked(input: AppPostObject) {
		if (!input) return false;
		return !!input.atProto?.viewer?.like || input.interaction.liked;
	}

	static isShared(input: AppPostObject) {
		if (!input) return false;
		return !!input.atProto?.viewer?.repost || input.interaction.boosted;
	}
}
