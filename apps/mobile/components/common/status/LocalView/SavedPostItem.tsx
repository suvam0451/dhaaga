import { PostContainer, SavedPostMoreOptionsButton } from '../_shared';
import { View } from 'react-native';
import { SavedPostCreatedBy } from '../fragments/PostCreatedBy';
import { appDimensions } from '../../../../styles/dimensions';
import { CollectionDataViewPostEntry } from '../../../../features/collections/reducers/collection-view.reducer';
import { TextContentView } from '../TextContentView';
import { LocalMediaItem } from '../../media/LocalView';

type SavedPostItemProps = {
	item: CollectionDataViewPostEntry;
};

const SECTION_MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

export function SavedPostItem({ item }: SavedPostItemProps) {
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
				<SavedPostMoreOptionsButton post={item.item} />
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
