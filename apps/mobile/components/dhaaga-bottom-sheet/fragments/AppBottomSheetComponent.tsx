import { memo, useMemo } from 'react';
import {
	BOTTOM_SHEET_ENUM,
	useAppBottomSheet,
} from '../modules/_api/useAppBottomSheet';
import PostPreview from '../modules/post-preview/PostPreview';
import WithComposerContext from '../modules/post-composer/api/useComposerContext';
import PostCompose from '../modules/post-composer/pages/PostCompose';
import ProfilePeekBottomSheet from '../modules/profile-peek/pages/ProfilePeekBottomSheet';

const AppBottomSheetComponent = memo(() => {
	const { type, requestId, PostComposerTextSeedRef } = useAppBottomSheet();
	return useMemo(() => {
		switch (type) {
			case BOTTOM_SHEET_ENUM.STATUS_PREVIEW: {
				return <PostPreview />;
			}
			case BOTTOM_SHEET_ENUM.STATUS_COMPOSER: {
				return (
					<WithComposerContext textSeed={PostComposerTextSeedRef.current}>
						<PostCompose />
					</WithComposerContext>
				);
			}
			case BOTTOM_SHEET_ENUM.PROFILE_PEEK:
				return <ProfilePeekBottomSheet />;
			default: {
				return (
					<WithComposerContext>
						<PostCompose />
					</WithComposerContext>
				);
			}
		}
	}, [type, requestId]);
});

export default AppBottomSheetComponent;
