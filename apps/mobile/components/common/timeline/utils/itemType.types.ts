import type { PostObjectType } from '@dhaaga/bridge';

export enum ListItemEnum {
	ListItemWithText,
	ListItemWithImage,
	ListItemWithSpoiler,
}

interface ListItemWithTextInterface {
	props: {
		dto: PostObjectType;
	};
	type: ListItemEnum.ListItemWithText;
}

interface ListItemWithImageInterface {
	props: {
		dto: PostObjectType;
	};
	type: ListItemEnum.ListItemWithImage;
}

interface ListItemWithSpoilerInterface {
	props: {
		dto: PostObjectType;
	};
	type: ListItemEnum.ListItemWithSpoiler;
}

export type ListItemType =
	| ListItemWithTextInterface
	| ListItemWithImageInterface
	| ListItemWithSpoilerInterface;
