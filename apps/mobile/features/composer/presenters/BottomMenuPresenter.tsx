import {
	useAppApiClient,
	useAppDialog,
	useAppTheme,
} from '#/states/global/hooks';
import { Fragment } from 'react';
import AutoFillPresenter from './AutoFillPresenter';
import { View } from 'react-native';
import ComposerActionListView from '../views/ComposerActionListView';
import { ActivityPubService } from '@dhaaga/bridge';
import PostVisibilityView from '../views/PostVisibilityView';
import useAppVisibility, {
	APP_POST_VISIBILITY,
} from '#/hooks/app/useVisibility';
import { DialogFactory } from '#/utils/dialog-factory';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';
import { useThreadGate } from '#/features/composer/hooks';
import {
	usePostComposerDispatch,
	usePostComposerState,
	PostComposerAction,
} from '@dhaaga/react';

function BottomMenuPresenter() {
	const { theme } = useAppTheme();
	const state = usePostComposerState();
	const dispatch = usePostComposerDispatch();
	const { driver } = useAppApiClient();
	const { show, hide } = useAppDialog();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.DIALOGS]);

	/**
	 * Visibility Related State Management
	 */
	async function setVisibility(visibility: APP_POST_VISIBILITY) {
		dispatch({
			type: PostComposerAction.SET_VISIBILITY,
			payload: {
				visibility,
			},
		});
		hide();
	}

	const { onPress: handleThreadGate } = useThreadGate();

	function handleVisibilityUpdate() {
		show(DialogFactory.changePostVisibility_ActivityPub(t, setVisibility));
	}

	function showVisibilityMenu() {
		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			handleThreadGate();
		} else {
			handleVisibilityUpdate();
		}
	}

	const { icon, text } = useAppVisibility(state.visibility);

	function toggleCwShown() {
		dispatch({
			type: PostComposerAction.TOGGLE_CW_SECTION_SHOWN,
		});
	}

	function onCustomEmojiClicked() {
		dispatch({
			type: PostComposerAction.SWITCH_TO_EMOJI_TAB,
		});
	}

	function onToggleMediaButton() {
		dispatch({
			type: PostComposerAction.SWITCH_TO_MEDIA_TAB,
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
					backgroundColor: theme.background.a10,
					// paddingVertical: 6, // 6 more comes from first button
					paddingLeft: 4,
					paddingRight: 10,
				}}
			>
				<ComposerActionListView
					canUseCw={!ActivityPubService.blueskyLike(driver)}
					canUseMedia={true}
					canUseVideo={
						false
						// ActivityPubService.blueskyLike(driver) &&
						// !AppService.isLiteEdition()
					}
					canUseGif={
						false
						// ActivityPubService.blueskyLike(driver) &&
						// !AppService.isLiteEdition()
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
