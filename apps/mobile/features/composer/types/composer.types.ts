import { InstanceApi_CustomEmojiDTO, TagInterface } from '@dhaaga/bridge';
import { AppUserObject } from '../../../types/app-user.types';

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
	accounts: AppUserObject[];
	hashtags: TagInterface[];
	emojis: InstanceApi_CustomEmojiDTO[];
};
