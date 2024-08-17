import { Realm } from 'realm';
import {
	StatusInterface,
	UnknownRestClient,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import activitypubAdapterService from '../activitypub-adapter.service';
import ActivityPubService from '../activitypub.service';
import { MMKV } from 'react-native-mmkv';
import GlobalMmkvCacheService from '../globalMmkvCache.services';
import { ActivityPubServerRepository } from '../../repositories/activitypub-server.repo';
import {
	ActivityPubStatusAppDtoType,
	ActivityPubStatusDto,
	ActivitypubStatusDtoService,
	ActivityPubStatusItemDto,
} from './activitypub-status-dto.service';
import ActivitypubAdapterService from '../activitypub-adapter.service';
import { z } from 'zod';

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
		const _subdomain = _user.getInstanceUrl();
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
		const x = new UnknownRestClient();

		// @ts-ignore-next-line
		for (const target of this.foundInstances) {
			// Cache-Policy
			const data = GlobalMmkvCacheService.getEmojiCacheForInstance(
				globalDb,
				target,
			);

			const now = new Date();
			const oneWeekAgo = new Date(now);
			oneWeekAgo.setDate(now.getDate() - 7);

			// all good
			if (
				data &&
				data?.data?.length > 0 &&
				new Date(data?.lastFetchedAt) >= oneWeekAgo
			) {
				return {
					success: true,
					message: 'Skipped',
					target: target,
					amount: data.data.length,
				};
			}

			const match = ActivityPubServerRepository.get(db, target);
			if (!match) {
				console.log(
					'[WARN]: trying to collect emojis for an' + ' unregistered instance',
				);
				continue;
			}

			const { data: emojiData, error: emojiError } =
				await x.instances.getCustomEmojis(target, match.type);

			if (emojiError) {
				console.log('[WARN]: failed to get emojis');
				continue;
			}
			GlobalMmkvCacheService.saveEmojiCacheForInstance(
				globalDb,
				target,
				emojiData,
			);
		}
	}

	// Static method that returns an instance of MyClass
	static factory(ref: StatusInterface, domain?: string, subdomain?: string) {
		return new ActivitypubStatusService(ref, domain, subdomain);
	}

	export(): ActivityPubStatusAppDtoType {
		const IS_REPOSTED = this.statusI.isReposted();

		let boostedFrom: z.infer<typeof ActivityPubStatusItemDto> = IS_REPOSTED
			? ActivitypubStatusDtoService.export(
					ActivitypubAdapterService.adaptStatus(
						this.statusI.getRepostedStatusRaw(),
						this.domain,
					),
					this.domain,
					this.subdomain,
				)
			: null;

		const dto: ActivityPubStatusAppDtoType = {
			...ActivitypubStatusDtoService.export(
				this.statusI,
				this.domain,
				this.subdomain,
			),
			boostedFrom,
		};

		const { data, error, success } = ActivityPubStatusDto.safeParse(dto);
		if (!success) {
			console.log('[ERROR]: status item dto validation failed', error);
			return;
		}

		return data;
	}
}
