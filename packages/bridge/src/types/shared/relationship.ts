import z from 'zod';

const appRelationObjectSchema = z.object({
	$type: z.literal('app.bsky.actor.defs#viewerState').optional(),
	muting: z.boolean().nullable(),
	blocking: z.union([z.boolean(), z.string()]).nullable(),
	blockedBy: z.union([z.boolean(), z.string()]).nullable(),
	following: z.union([z.boolean(), z.string()]).nullable(),
	followedBy: z.union([z.boolean(), z.string()]).nullable(),
	/**
	 * mastodon
	 */

	/** Are you receiving this user's boosts in your home timeline? */
	showingReblogs: z.boolean().nullable(),
	/** Have you enabled notifications for this user? */
	notifying: z.boolean().nullable(),
	/** Which languages are you following from this user? */
	languages: z.array(z.string()),
	/** Are you muting notifications from this user? */
	mutingNotifications: z.boolean().nullable(),
	/** Do you have a pending follow request for this user? */
	requested: z.boolean().nullable(),
	/** Are you blocking this user's domain? */
	domainBlocking: z.boolean().nullable(),
	/** Are you featuring this user on your profile? */
	endorsed: z.boolean().nullable(),
	/** Personal note for this account */
	note: z.string().nullable(),
});

/**
 * This typing stores the relation object against
 * another user, as is expected to be passed
 * around throughout the app
 */
type RelationObjectType = z.infer<typeof appRelationObjectSchema>;

export { appRelationObjectSchema };
export type { RelationObjectType };
