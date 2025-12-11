import { FlatList, View } from 'react-native';
import { useAppBottomSheet } from '#/states/global/hooks';
import { useApiGetPostComments } from '#/hooks/api/usePostInteractions';
import { useState } from 'react';
import BottomSheetMenu from '#/components/dhaaga-bottom-sheet/components/BottomSheetMenu';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';
import BearError from '#/components/svgs/BearError';
import { NativeTextMedium } from '#/ui/NativeText';

function ShowCommentsBottomSheet() {
	const { ctx } = useAppBottomSheet();

	const [MaxId, setMaxId] = useState(null);

	const { data, error } = useApiGetPostComments(
		ctx.$type === 'post-id' ? ctx.postId : null,
		MaxId,
	);

	return (
		<FlatList
			ListHeaderComponent={
				<BottomSheetMenu title={'Comments'} variant={'clear'} />
			}
			data={data?.data}
			renderItem={({ item }) => (
				<View>
					<NativeTextMedium>{item.avatarUrl}</NativeTextMedium>
				</View>
			)}
			ListEmptyComponent={
				<ErrorPageBuilder
					stickerArt={<BearError />}
					errorMessage={error?.message}
					errorDescription={'Failed to load comments'}
				/>
			}
		/>
	);
}

export default ShowCommentsBottomSheet;
