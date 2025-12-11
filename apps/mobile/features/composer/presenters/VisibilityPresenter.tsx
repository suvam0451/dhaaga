import useAppVisibility, {
	APP_POST_VISIBILITY,
} from '#/hooks/app/useVisibility';
import { PostComposerReducerActionType } from '../reducers/composer.reducer';
import { DialogBuilderService } from '#/services/dialog-builder.service';
import { useAppDialog } from '#/states/global/hooks';
import { useComposerCtx } from '../contexts/useComposerCtx';
import PostVisibilityView from '../views/PostVisibilityView';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';

function VisibilityPresenter() {
	const { state, dispatch } = useComposerCtx();
	const { show, hide } = useAppDialog();
	const { icon, text } = useAppVisibility(state.visibility);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	async function setVisibility(visibility: APP_POST_VISIBILITY) {
		dispatch({
			type: PostComposerReducerActionType.SET_VISIBILITY,
			payload: {
				visibility,
			},
		});
		hide();
	}

	function showVisibilityPicker() {
		show(
			DialogBuilderService.changePostVisibility_ActivityPub(t, setVisibility),
		);
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
