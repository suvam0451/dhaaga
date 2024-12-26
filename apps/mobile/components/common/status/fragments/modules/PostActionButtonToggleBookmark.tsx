import { memo, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTimelinePosts } from '../../../../../hooks/app/timelines/useAppTimelinePosts';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../../../states/_global';
import {
	useAppBottomSheet_Improved,
	useAppManager,
} from '../../../../../hooks/utility/global-state-extractors';
import { APP_BOTTOM_SHEET_ENUM } from '../../../../dhaaga-bottom-sheet/Core';

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
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);
		const { show } = useAppBottomSheet_Improved();
		const { appManager } = useAppManager();

		// helper functions
		function _toggleBookmark() {
			// toggleBookmark(id, setIsBookmarkStatePending);

			// appManager.storage.setPostObject();
			show(APP_BOTTOM_SHEET_ENUM.ADD_BOOKMARK, true);
		}

		useEffect(() => {
			if (!isFinal) {
				getBookmarkState(id, setIsBookmarkStatePending);
			}
		}, [id]);

		// NOTE: looks inconsistent
		// if (activePack.valid) {
		// 	return (
		// 		<TouchableOpacity style={styles.root} onPress={_toggleBookmark}>
		// 			{IsBookmarkStatePending ? (
		// 				<ActivityIndicator size={'small'} />
		// 			) : flag ? (
		// 				// @ts-ignore-next-line
		// 				<Image
		// 					source={{ uri: activePack.bookmarkActive1.localUri }}
		// 					style={{ height: ICON_SIZE, width: ICON_SIZE }}
		// 				/>
		// 			) : (
		// 				// @ts-ignore-next-line
		// 				<Image
		// 					source={{ uri: activePack.bookmarkInactive.localUri }}
		// 					style={{ height: ICON_SIZE, width: ICON_SIZE }}
		// 				/>
		// 			)}
		// 		</TouchableOpacity>
		// 	);
		// }
		return (
			<TouchableOpacity style={styles.root} onPress={_toggleBookmark}>
				{IsBookmarkStatePending ? (
					<ActivityIndicator size={'small'} />
				) : (
					<Ionicons
						color={flag ? theme.complementary.a0 : theme.secondary.a10}
						name={flag ? 'bookmark' : 'bookmark-outline'}
						size={ICON_SIZE}
					/>
				)}
			</TouchableOpacity>
		);
	},
);

export default PostActionButtonToggleBookmark;

const styles = StyleSheet.create({
	root: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		// marginRight: 16,
		paddingTop: 8,
		paddingBottom: 8,
	},
});
