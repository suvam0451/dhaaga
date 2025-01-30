import useAppVisibility, {
	APP_POST_VISIBILITY,
} from '../../../hooks/app/useVisibility';
import { PostComposerReducerActionType } from '../../../states/interactors/post-composer.reducer';
import { DialogBuilderService } from '../../../services/dialog-builder.service';
import { useAppDialog } from '../../../hooks/utility/global-state-extractors';
import { useComposerCtx } from '../contexts/useComposerCtx';
import PostVisibilityView from '../views/PostVisibilityView';

function VisibilityPresenter() {
	const { state, dispatch } = useComposerCtx();
	const { show, hide } = useAppDialog();
	const { icon, text } = useAppVisibility(state.visibility);

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
		show(DialogBuilderService.changePostVisibility_ActivityPub(setVisibility));
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
