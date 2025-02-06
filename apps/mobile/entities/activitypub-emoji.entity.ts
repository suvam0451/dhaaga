export type ActivityPubCustomEmojiItemDTO = {
	shortcode: string;
	url: string;
	staticUrl: string;
	visibleInPicker: boolean;
	category: string;
	aliases: string[];
};

export class ActivityPubCustomEmojiItem extends Object {
	shortcode: string;
	url: string;
	staticUrl: string;
	visibleInPicker: boolean;
	timesUsed: number;
}
