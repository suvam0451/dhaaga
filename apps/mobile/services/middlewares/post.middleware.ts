import {
	ActivitypubStatusAdapter,
	StatusInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import activitypubAdapterService from '../activitypub-adapter.service';
import {
	AppPostObject,
	AppStatusDtoService,
	ActivityPubStatusItemDto,
	appPostObjectSchema,
} from '../../types/app-post.types';
import ActivitypubAdapterService from '../activitypub-adapter.service';
import { z } from 'zod';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import AppPrivacySettingsService from '../app-settings/app-settings-privacy.service';
import { SQLiteDatabase } from 'expo-sqlite';

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
			this.statusI.print();
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
		if (Array.isArray(input)) {
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
}
