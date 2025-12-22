import useAppVisibility, {
	APP_POST_VISIBILITY,
} from '#/hooks/app/useVisibility';
import { DialogFactory } from '#/utils/dialog-factory';
import { useAppDialog } from '#/states/global/hooks';
import PostVisibilityView from '../views/PostVisibilityView';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import {
	usePostComposerDispatch,
	usePostComposerState,
	PostComposerAction,
} from '@dhaaga/react';

function VisibilityPresenter() {
	const state = usePostComposerState();
	const dispatch = usePostComposerDispatch();
	const { show, hide } = useAppDialog();
	const { icon, text } = useAppVisibility(state.visibility);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	async function setVisibility(visibility: APP_POST_VISIBILITY) {
		dispatch({
			type: PostComposerAction.SET_VISIBILITY,
			payload: {
				visibility,
			},
		});
		hide();
	}

	function showVisibilityPicker() {
		show(DialogFactory.changePostVisibility_ActivityPub(t, setVisibility));
	}

	return (
		<PostVisibilityView
			onPress={showVisibilityPicker}
			Icon={icon}
			label={text}
		/>
	);
}

export default VisibilityPresenter;
