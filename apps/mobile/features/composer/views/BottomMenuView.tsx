import {
	useAppApiClient,
	useAppDialog,
	useAppTheme,
} from '#/states/global/hooks';
import AutoFillPresenter from '../presenters/AutoFillPresenter';
import { View } from 'react-native';
import ComposerActionListView from './ComposerActionListView';
import PostVisibilityView from './PostVisibilityView';
import useAppVisibility, {
	APP_POST_VISIBILITY,
} from '#/hooks/app/useVisibility';
import { DialogFactory } from '#/utils/dialog-factory';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';
import {
	usePostComposerDispatch,
	usePostComposerState,
	PostComposerAction,
} from '@dhaaga/react';
import useThreadGates from '#/features/composer/hooks/useThreadGates';

function BottomMenuView() {
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

	const { onPress: handleThreadGate } = useThreadGates();

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

	return (
		<>
			<AutoFillPresenter />
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: theme.background.a10,
					paddingLeft: 4,
					paddingRight: 10,
				}}
			>
				<ComposerActionListView />
				<PostVisibilityView
					label={text}
					Icon={icon}
					onPress={showVisibilityMenu}
				/>
			</View>
		</>
	);
}

export default BottomMenuView;
