import { z } from 'zod';
import {
	ActivitypubHelper,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';

const ActivityPubUserDTO = z.object({
	id: z.string(),
	avatarUrl: z.string(),
	displayName: z.string().nullable(),
	handle: z.string().regex(/^@.*?@?.*?$/),
	instance: z.string(),
	meta: z.object({
		isProfileLocked: z.boolean(),
		isBot: z.boolean(),
	}),
	description: z.string(),
	stats: z.object({
		posts: z.number().nullable(),
		followers: z.number().nullable(),
		following: z.number().nullable(),
	}),
});

export type ActivityPubAppUserDtoType = z.infer<typeof ActivityPubUserDTO>;

class ActivityPubUserDtoService {
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
	): ActivityPubAppUserDtoType | null {
		const dto: ActivityPubAppUserDtoType = {
			id: input.getId(),
			description: input.getDescription() || '',
			avatarUrl: input.getAvatarUrl(),
			displayName: input.getDisplayName(),
			handle: ActivitypubHelper.getHandle(
				input?.getAccountUrl(subdomain),
				subdomain,
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
			},
		};

		const { data, error, success } = ActivityPubUserDTO.safeParse(dto);
		if (!success) {
			console.log('[ERROR]: user dto validation failed', error);
			return null;
		}

		return data as ActivityPubAppUserDtoType;
	}
}

export default ActivityPubUserDtoService;
