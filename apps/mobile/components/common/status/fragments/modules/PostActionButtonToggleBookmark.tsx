import { memo, useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_FONT, APP_THEME } from '../../../../../styles/AppTheme';
import { useAppTimelinePosts } from '../../../../../hooks/app/timelines/useAppTimelinePosts';

const ICON_SIZE = 24;

type PostActionButtonToggleBookmarkProps = {
	id: string;
	flag: boolean;
	isFinal: boolean;
};

/**
 * Bookmark toggle indicator button
 */
const PostActionButtonToggleBookmark = memo(
	({ id, flag, isFinal }: PostActionButtonToggleBookmarkProps) => {
		const [IsBookmarkStatePending, setIsBookmarkStatePending] = useState(false);
		const { toggleBookmark, getBookmarkState } = useAppTimelinePosts();

		// helper functions
		function _toggleBookmark() {
			toggleBookmark(id, setIsBookmarkStatePending);
		}

		useEffect(() => {
			if (!isFinal) {
				getBookmarkState(id, setIsBookmarkStatePending);
			}
		}, [id]);

		return (
			<TouchableOpacity
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					marginRight: 12,
					paddingTop: 8,
					paddingBottom: 8,
				}}
				onPress={_toggleBookmark}
			>
				{IsBookmarkStatePending ? (
					<ActivityIndicator size={'small'} />
				) : (
					<Ionicons
						color={flag ? APP_THEME.INVALID_ITEM : APP_FONT.MEDIUM_EMPHASIS}
						name={flag ? 'bookmark' : 'bookmark-outline'}
						size={ICON_SIZE}
					/>
				)}
			</TouchableOpacity>
		);
	},
);

export default PostActionButtonToggleBookmark;
