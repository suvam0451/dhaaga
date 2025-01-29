import {
	useAppApiClient,
	useAppDialog,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { useComposerCtx } from '../contexts/useComposerCtx';
import { PostComposerReducerActionType } from '../../../states/interactors/post-composer.reducer';
import { Fragment } from 'react';
import AutoFillPresenter from './AutoFillPresenter';
import { View } from 'react-native';
import ComposerActionListView from '../views/ComposerActionListView';
import ActivitypubService from '../../../services/activitypub.service';
import { AppService } from '../../../services/app.service';
import ActivityPubService from '../../../services/activitypub.service';
import PostVisibilityView from '../views/PostVisibilityView';
import useAppVisibility, {
	APP_POST_VISIBILITY,
} from '../../../hooks/app/useVisibility';
import { DialogBuilderService } from '../../../services/dialog-builder.service';

function BottomMenuPresenter() {
	const { theme } = useAppTheme();
	const { state, dispatch } = useComposerCtx();
	const { driver } = useAppApiClient();

	const { show, hide } = useAppDialog();

	/**
	 * Visibility Related State Management
	 */
	async function setVisibility(visibility: APP_POST_VISIBILITY) {
		dispatch({
			type: PostComposerReducerActionType.SET_VISIBILITY,
			payload: {
				visibility,
			},
		});
		hide();
	}

	function showVisibilityMenu() {
		show(DialogBuilderService.changePostVisibility_ActivityPub(setVisibility));
	}

	const { icon, text } = useAppVisibility(state.visibility);

	function toggleCwShown() {
		dispatch({
			type: PostComposerReducerActionType.TOGGLE_CW_SECTION_SHOWN,
		});
	}

	function onCustomEmojiClicked() {
		dispatch({
			type: PostComposerReducerActionType.SWITCH_TO_EMOJI_TAB,
		});
	}

	function onToggleMediaButton() {
		dispatch({
			type: PostComposerReducerActionType.SWITCH_TO_MEDIA_TAB,
		});
	}

	function onVideoPressed() {}

	function onGifPressed() {}

	return (
		<Fragment>
			<AutoFillPresenter />
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: theme.background.a30,
					paddingVertical: 6,
					// 6 more comes from first button
					paddingLeft: 4,
					paddingRight: 10,
				}}
			>
				<ComposerActionListView
					canUseCw={!ActivitypubService.blueskyLike(driver)}
					canUseMedia={true}
					canUseVideo={
						ActivitypubService.blueskyLike(driver) &&
						!AppService.isLiteEdition()
					}
					canUseGif={
						ActivityPubService.blueskyLike(driver) &&
						!AppService.isLiteEdition()
					}
					canUseCustomEmoji={
						ActivityPubService.pleromaLike(driver) ||
						ActivityPubService.misskeyLike(driver)
					}
					isMediaDisabled={false}
					isVideoDisabled={false}
					isGifDisabled={false}
					isCwUsed={!!state.cw}
					mediaCount={state.medias.length}
					isVideoUsed={false}
					isGifUsed={false}
					onCwPressed={toggleCwShown}
					onMediaPressed={onToggleMediaButton}
					onVideoPressed={onVideoPressed}
					onGifPressed={onGifPressed}
					onCustomEmojiPressed={onCustomEmojiClicked}
				/>
				<PostVisibilityView
					label={text}
					Icon={icon}
					onPress={showVisibilityMenu}
				/>
			</View>
		</Fragment>
	);
}

export default BottomMenuPresenter;
