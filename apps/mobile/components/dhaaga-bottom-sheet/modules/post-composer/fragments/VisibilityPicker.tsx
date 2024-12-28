import { Dispatch, memo, SetStateAction, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import useAppVisibility, {
	APP_POST_VISIBILITY,
} from '../../../../../hooks/app/useVisibility';
import { useComposerContext } from '../api/useComposerContext';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import {
	useAppDialog,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';
import { DialogBuilderService } from '../../../../../services/dialog-builder.service';
import { PostComposerReducerActionType } from '../../../../../states/reducers/post-composer.reducer';

const VisibilityPickerChoice = memo(function Foo({
	visibility,
}: {
	visibility: APP_POST_VISIBILITY;
	setVisibility: Dispatch<SetStateAction<boolean>>;
}) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	const { icon, text, desc } = useAppVisibility(visibility);
	const { dispatch } = useComposerContext();

	function onPress() {
		dispatch({
			type: PostComposerReducerActionType.SET_VISIBILITY,
			payload: {
				visibility,
			},
		});
	}

	return (
		<TouchableOpacity
			style={[styles.choiceContainerWithDesc]}
			onPress={onPress}
		>
			<View>
				<Text style={[styles.choiceText, { color: theme.complementary.a0 }]}>
					{text}
				</Text>
				<Text
					style={[
						styles.choiceTextDescription,
						{
							color: theme.textColor.medium,
						},
					]}
				>
					{desc}
				</Text>
			</View>
			{icon}
		</TouchableOpacity>
	);
});

const VisibilityPicker = memo(function Foo() {
	const [IsExpanded, setIsExpanded] = useState(false);
	const { state, dispatch } = useComposerContext();
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
		<TouchableOpacity
			onPress={showVisibilityMenu}
			style={{ position: 'relative', maxWidth: 360, overflow: 'visible' }}
		>
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

			<View
				style={{
					position: 'absolute',
					display: IsExpanded ? 'flex' : 'none',
					zIndex: 200,
					backgroundColor: theme.palette.menubar,
					paddingBottom: 12,
					marginBottom: 6,
					padding: 8,
					borderRadius: 8,
					transform: [{ translateY: '-50%' }],
				}}
				// entering={SlideInUp}
			>
				<VisibilityPickerChoice
					visibility={APP_POST_VISIBILITY.PUBLIC}
					setVisibility={setIsExpanded}
				/>
				<VisibilityPickerChoice
					visibility={APP_POST_VISIBILITY.UNLISTED}
					setVisibility={setIsExpanded}
				/>
				<VisibilityPickerChoice
					visibility={APP_POST_VISIBILITY.PRIVATE}
					setVisibility={setIsExpanded}
				/>
				<VisibilityPickerChoice
					visibility={APP_POST_VISIBILITY.DIRECT}
					setVisibility={setIsExpanded}
				/>
			</View>
		</TouchableOpacity>
	);
});

const styles = StyleSheet.create({
	choiceText: {
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		fontSize: 16,
	},
	choiceTextDescription: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		fontSize: 14,
		marginLeft: 6,
	},
	choiceContainer: {
		padding: 6,
		paddingHorizontal: 8,
		borderRadius: 8,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	choiceContainerWithDesc: {
		padding: 6,
		paddingHorizontal: 8,
		borderRadius: 8,
		minWidth: 196,
		alignItems: 'center',
		flexDirection: 'row',
		marginVertical: 2,
	},
});

export default VisibilityPicker;
