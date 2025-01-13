import { AccountSavedPost } from '../../../../database/_schema';
import { PostContainer, SavedPostMoreOptionsButton } from '../_shared';
import { View } from 'react-native';
import { SavedPostCreatedBy } from '../fragments/PostCreatedBy';
import { appDimensions } from '../../../../styles/dimensions';

type SavedPostItemProps = {
	item: AccountSavedPost;
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
					user={item.savedUser}
					authoredAt={item.authoredAt}
				/>
				<SavedPostMoreOptionsButton post={item} />
			</View>
		</PostContainer>
	);
}
