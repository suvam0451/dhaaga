import { Realm } from 'realm';
import {
	StatusInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import activitypubAdapterService from '../activitypub-adapter.service';
import ActivityPubService from '../activitypub.service';
import { MMKV } from 'react-native-mmkv';
import {
	ActivityPubStatusAppDtoType,
	AppStatusDtoService,
	ActivityPubStatusItemDto,
	ActivityPubStatusLevelThree,
} from './app-status-dto.service';
import ActivitypubAdapterService from '../activitypub-adapter.service';
import { z } from 'zod';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import AppPrivacySettingsService from '../app-settings/app-settings-privacy.service';
import { EmojiService } from '../emoji.service';

/**
 * Supports various operations
 * on a Status Interface object
 */
export class ActivitypubStatusService {
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

	constructor(ref: StatusInterface, domain: string, subdomain: string) {
		this.statusI = ref;
		this.domain = domain;
		this.subdomain = subdomain;
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

	async syncSoftware(db: Realm) {
		// Privacy --> Advanced --> Remote Instance Calls --> Reaction Caching
		if (
			AppPrivacySettingsService.create(
				db,
			).isDisabledCrossInstanceSoftwareCaching()
		) {
			// console.log('[INFO]: prevented cross instance api call for software');
			return this;
		}

		const promises = Array.from(this.foundInstances).map((o) => {
			return ActivityPubService.syncSoftware(db, o);
		});
		await Promise.all(promises);
		return this;
	}

	/**
	 * Sync the custom emoji cache
	 *
	 * Cache-Policy: 1w
	 * @param db
	 * @param globalDb
	 */
	async syncCustomEmojis(db: Realm, globalDb: MMKV) {
		// @ts-ignore-next-line
		for (const target of this.foundInstances) {
			await EmojiService.refresh(db, globalDb, target);
		}
	}

	// Static method that returns an instance of MyClass
	static factory(ref: StatusInterface, domain?: string, subdomain?: string) {
		return new ActivitypubStatusService(ref, domain, subdomain);
	}

	export(): ActivityPubStatusAppDtoType {
		// console.log('step 1/4');
		// to prevent infinite recursion
		if (!this.statusI || !this.statusI.getId()) return null;

		const IS_REPOSTED = this.statusI.isReposted();
		const IS_REPLY = this.statusI.isReply();

		let boostedFrom: z.infer<typeof ActivityPubStatusItemDto> = IS_REPOSTED
			? new ActivitypubStatusService(
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
				? new ActivitypubStatusService(
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
				? new ActivitypubStatusService(
						ActivitypubAdapterService.adaptStatus(
							this.statusI.getRootRaw(),
							this.domain,
						),
						this.domain,
						this.subdomain,
					).export()
				: null;
		// console.log('step 4/4');

		const dto: ActivityPubStatusAppDtoType =
			IS_REPLY &&
			[
				KNOWN_SOFTWARE.MISSKEY,
				KNOWN_SOFTWARE.FIREFISH,
				KNOWN_SOFTWARE.SHARKEY,
				KNOWN_SOFTWARE.BLUESKY,
			].includes(this.domain as any)
				? /**
					 * 	Replies in Misskey is actually present in the
					 * 	"reply" object, instead of root. へんですね?
					 */
					{
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
		// console.log('step END');

		const { data, error, success } = ActivityPubStatusLevelThree.safeParse(dto);
		if (!success) {
			console.log('[ERROR]: status item dto validation failed', error);
			return;
		}

		return data as ActivityPubStatusAppDtoType;
	}
}
