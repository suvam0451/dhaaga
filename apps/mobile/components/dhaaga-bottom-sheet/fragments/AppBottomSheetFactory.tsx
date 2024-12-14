import { memo, useMemo } from 'react';
import PostPreview from '../modules/post-preview/PostPreview';
import WithComposerContext from '../modules/post-composer/api/useComposerContext';
import PostCompose from '../modules/post-composer/pages/PostCompose';
import AppBottomSheetProfilePeek from '../modules/profile-peek/AppBottomSheetProfilePeek';
import PostMoreActions from '../modules/post-actions/pages/PostMoreActions';
import AppBottomSheetReactionDetails from '../modules/reaction-details/AppBottomSheetReactionDetails';
import AppBottomSheetSelectAccount from '../modules/select-account/AppBottomSheetSelectAccount';
import AppBottomSheetPickThemePack from '../modules/theme-pack/AppBottomSheetPickThemePack';
import useGlobalState, { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import AppBottomSheetTimelineDetails from '../modules/timeline-details/AppBottomSheetTimelineDetails';

/**
 * Responsible for generating content
 */
const AppBottomSheetFactory = memo(() => {
	const { type, stateId, PostComposerTextSeedRef } = useGlobalState(
		useShallow((o) => ({
			type: o.bottomSheet.type,
			stateId: o.bottomSheet.stateId,
			PostComposerTextSeedRef: o.bottomSheet.PostComposerTextSeedRef,
		})),
	);
	return useMemo(() => {
		switch (type) {
			case APP_BOTTOM_SHEET_ENUM.STATUS_PREVIEW: {
				return <PostPreview />;
			}
			case APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER: {
				return (
					<WithComposerContext textSeed={PostComposerTextSeedRef}>
						<PostCompose />
					</WithComposerContext>
				);
			}
			case APP_BOTTOM_SHEET_ENUM.PROFILE_PEEK:
				return <AppBottomSheetProfilePeek />;
			case APP_BOTTOM_SHEET_ENUM.MORE_POST_ACTIONS:
				return <PostMoreActions />;
			case APP_BOTTOM_SHEET_ENUM.REACTION_DETAILS:
				return <AppBottomSheetReactionDetails />;
			case APP_BOTTOM_SHEET_ENUM.SELECT_ACCOUNT:
				return <AppBottomSheetSelectAccount />;
			case APP_BOTTOM_SHEET_ENUM.SWITCH_THEME_PACK:
				return <AppBottomSheetPickThemePack />;
			case APP_BOTTOM_SHEET_ENUM.TIMELINE_CONTROLLER:
				return <AppBottomSheetTimelineDetails />;
			default: {
				return (
					<WithComposerContext>
						<PostCompose />
					</WithComposerContext>
				);
			}
		}
	}, [type, stateId]);
});

export default AppBottomSheetFactory;
