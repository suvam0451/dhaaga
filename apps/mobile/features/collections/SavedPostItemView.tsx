import {
	PostContainer,
	SavedPostMoreOptionsButton,
} from '#/components/common/status/_shared';
import { View } from 'react-native';
import { SavedPostCreatedBy } from '#/components/common/status/fragments/PostCreatedBy';
import { appDimensions } from '#/styles/dimensions';
import { CollectionDataViewPostEntry } from './reducers/collection-detail.reducer';
import { TextContentView } from '#/components/common/status/TextContentView';
import { LocalMediaItem } from '#/components/common/media/LocalView';

type SavedPostItemProps = {
	item: CollectionDataViewPostEntry;
};

const SECTION_MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

export function SavedPostItemView({ item }: SavedPostItemProps) {
	return (
		<PostContainer>
			<View
				style={{
					flexDirection: 'row',
					marginBottom: SECTION_MARGIN_BOTTOM,
				}}
			>
				<SavedPostCreatedBy
					style={{
						paddingBottom: 4,
						flex: 1,
					}}
					user={item.item.savedUser}
					authoredAt={item.item.authoredAt}
				/>
				<SavedPostMoreOptionsButton postId={item.item.uuid} />
			</View>
			<LocalMediaItem items={item.item.medias} />
			<TextContentView
				tree={item.parsedTextContent}
				variant={'bodyContent'}
				mentions={[]}
				emojiMap={new Map()}
				style={{
					marginBottom:
						item.parsedTextContent.length === 0 ? 0 : SECTION_MARGIN_BOTTOM,
				}}
			/>
		</PostContainer>
	);
}
