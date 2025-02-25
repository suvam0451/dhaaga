import { ActivitypubHelper, UserInterface } from '@dhaaga/bridge';
import ActivityPubAdapterService from '../activitypub-adapter.service';
import { AppUserObject, appUserObjectSchema } from '../../types/app-user.types';

class AppUserService {
	/**
	 * A lot of things are defaulted,
	 * because Misskey returns partial
	 * result for some endpoints
	 *
	 * ^ e.g. - reaction list
	 * @param input
	 * @param domain
	 * @param subdomain
	 */
	static export(
		input: UserInterface,
		domain: string,
		subdomain: string,
	): AppUserObject | null {
		const dto: AppUserObject = {
			id: input.getId(),
			displayName: input.getDisplayName(),
			description: input.getDescription() || '',
			avatarUrl: input.getAvatarUrl(),
			banner: input.getBannerUrl(),
			handle: ActivitypubHelper.getHandle(
				input?.getAccountUrl(subdomain),
				subdomain,
				domain,
			),
			instance: input.getInstanceUrl() || subdomain,
			stats: {
				posts: input.getPostCount() || 0,
				followers: input.getFollowersCount() || 0,
				following: input.getFollowersCount() || 0,
			},
			meta: {
				// NOTE: be careful using these in misskey
				isBot: input.getIsBot() || false,
				isProfileLocked: input.getIsLockedProfile() || false,
				fields: input.getFields() || [],
			},
			calculated: {
				emojis: input.getEmojiMap(),
			},
		};

		const { data, error, success } = appUserObjectSchema.safeParse(dto);
		if (!success) {
			console.log('[ERROR]: user dto validation failed', error);
			console.log(input);
			return null;
		}

		return data as AppUserService;
	}

	static exportRaw(
		input: any,
		domain: string,
		subdomain: string,
	): AppUserObject {
		const _interface = ActivityPubAdapterService.adaptUser(input, domain);
		return AppUserService.export(_interface, domain, subdomain);
	}

	/**
	 *
	 * @param input
	 * @param domain
	 * @param subdomain
	 */
	static exportRawMultiple(
		input: any[],
		domain: string,
		subdomain: string,
	): AppUserService[] {
		return input
			.map((o) => ActivityPubAdapterService.adaptUser(o, domain))
			.filter((o) => !!o)
			.map((o) => AppUserService.export(o, domain, subdomain));
	}
}

export default AppUserService;
