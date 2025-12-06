export type CustomEmojiObject = {
	shortCode: string;
	url: string;
	staticUrl: string;
	visibleInPicker: boolean;
	category?: string | null;
	aliases: string[];
	tags: string[];
};
