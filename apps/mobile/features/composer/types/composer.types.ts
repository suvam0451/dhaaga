import { InstanceApi_CustomEmojiDTO, TagTargetInterface } from '@dhaaga/bridge';
import type { UserObjectType } from '@dhaaga/bridge';

/**
 * Indicates what is currently being typed
 * into the TextInput, and what type of
 * suggestion to generate, based on what was
 * typed ahead. Some examples:
 *
 * :part: --> "emoji"
 * #part --> "tag"
 * @part or @foo@part --> "acct"
 */
export type AutoFillPromptType = {
	q: string;
	type: 'acct' | 'tag' | 'emoji' | 'none';
};

export type AutoFillResultsType = {
	accounts: UserObjectType[];
	hashtags: TagTargetInterface[];
	emojis: InstanceApi_CustomEmojiDTO[];
};
