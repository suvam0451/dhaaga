import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import useAppVisibility, {
	APP_POST_VISIBILITY,
} from '../../../../../hooks/app/useVisibility';
import { useComposerCtx } from '../../../../../features/composer/contexts/useComposerCtx';
import {
	useAppDialog,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';
import { DialogBuilderService } from '../../../../../services/dialog-builder.service';
import { PostComposerReducerActionType } from '../../../../../states/interactors/post-composer.reducer';

function VisibilityPicker() {
	const { state, dispatch } = useComposerCtx();
	const { theme } = useAppTheme();
	const { show, hide } = useAppDialog();

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
	return (
		<TouchableOpacity onPress={showVisibilityMenu} style={{}}>
			<View style={[styles.choiceContainer]}>
				<Text
					style={[
						styles.choiceText,
						{
							color: theme.complementary.a0,
						},
					]}
				>
					{text}
				</Text>
				<View style={{ marginLeft: 6, width: 24 }}>{icon}</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	choiceText: {
		fontFamily: APP_FONTS.ROBOTO_500,
		fontSize: 16,
	},
	choiceContainer: {
		padding: 6,
		alignItems: 'center',
		flexDirection: 'row',
	},
});

export default VisibilityPicker;
