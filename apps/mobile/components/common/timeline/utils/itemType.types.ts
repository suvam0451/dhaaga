import { ActivityPubStatusAppDtoType } from '../../../../services/approto/app-status-dto.service';

export enum ListItemEnum {
	ListItemWithText,
	ListItemWithImage,
	ListItemWithSpoiler,
}

interface ListItemWithTextInterface {
	props: {
		dto: ActivityPubStatusAppDtoType;
	};
	type: ListItemEnum.ListItemWithText;
}

interface ListItemWithImageInterface {
	props: {
		dto: ActivityPubStatusAppDtoType;
	};
	type: ListItemEnum.ListItemWithImage;
}

interface ListItemWithSpoilerInterface {
	props: {
		dto: ActivityPubStatusAppDtoType;
	};
	type: ListItemEnum.ListItemWithSpoiler;
}

export type ListItemType =
	| ListItemWithTextInterface
	| ListItemWithImageInterface
	| ListItemWithSpoilerInterface;
