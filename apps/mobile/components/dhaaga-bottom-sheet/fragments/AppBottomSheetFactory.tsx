import { memo, useMemo } from 'react';
import {
	APP_BOTTOM_SHEET_ENUM,
	useAppBottomSheet,
} from '../modules/_api/useAppBottomSheet';
import PostPreview from '../modules/post-preview/PostPreview';
import WithComposerContext from '../modules/post-composer/api/useComposerContext';
import PostCompose from '../modules/post-composer/pages/PostCompose';
import ProfilePeekBottomSheet from '../modules/profile-peek/pages/ProfilePeekBottomSheet';
import PostMoreActions from '../modules/post-actions/pages/PostMoreActions';
import ReactionDetailsBottomSheet from '../modules/reaction-details/pages/ReactionDetailsBottomSheet';

/**
 * Responsible for generating content
 */
const AppBottomSheetFactory = memo(() => {
	const { type, requestId, PostComposerTextSeedRef } = useAppBottomSheet();
	return useMemo(() => {
		switch (type) {
			case APP_BOTTOM_SHEET_ENUM.STATUS_PREVIEW: {
				return <PostPreview />;
			}
			case APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER: {
				return (
					<WithComposerContext textSeed={PostComposerTextSeedRef.current}>
						<PostCompose />
					</WithComposerContext>
				);
			}
			case APP_BOTTOM_SHEET_ENUM.PROFILE_PEEK:
				return <ProfilePeekBottomSheet />;
			case APP_BOTTOM_SHEET_ENUM.MORE_POST_ACTIONS:
				return <PostMoreActions />;
			case APP_BOTTOM_SHEET_ENUM.REACTION_DETAILS: {
				return <ReactionDetailsBottomSheet />;
			}
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

export default AppBottomSheetFactory;
