import { Dispatch, memo, SetStateAction, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { APP_FONT } from '../../../../../styles/AppTheme';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import useAppVisibility, {
	APP_POST_VISIBILITY,
} from '../../../../../hooks/app/useVisibility';
import { useComposerContext } from '../api/useComposerContext';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const VisibilityPickerChoice = memo(function Foo({
	visibility,
	setVisibility,
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
	const { setVisibility: ComposerVisibility } = useComposerContext();

	function onPress() {
		setVisibility(false);
		ComposerVisibility(visibility);
	}

	return (
		<TouchableOpacity
			style={[styles.choiceContainerWithDesc]}
			onPress={onPress}
		>
			{icon}
			<View style={{ flexDirection: 'column' }}>
				<Text style={[styles.choiceText, { color: theme.textColor.high }]}>
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
		</TouchableOpacity>
	);
});

const VisibilityPicker = memo(function Foo() {
	const [IsExpanded, setIsExpanded] = useState(false);
	const { visibility: ComposerVisibility } = useComposerContext();
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	function toggleExpanded() {
		setIsExpanded((o) => !o);
	}

	const { icon, text } = useAppVisibility(ComposerVisibility as any);
	return (
		<TouchableOpacity
			onPress={toggleExpanded}
			style={{ position: 'relative', maxWidth: 360 }}
		>
			<View
				style={[
					styles.choiceContainer,
					{ backgroundColor: theme.palette.buttonUnstyled },
				]}
			>
				{icon}
				<Text
					style={[
						styles.choiceText,
						{
							color: theme.textColor.high,
						},
					]}
				>
					{text}
				</Text>
			</View>

			<Animated.View
				style={{
					position: 'absolute',
					display: IsExpanded ? 'flex' : 'none',
					bottom: '100%',
					zIndex: 99,
					backgroundColor: theme.palette.menubar,
					paddingBottom: 12,
					marginBottom: 6,
					padding: 8,
					borderRadius: 8,
				}}
				entering={SlideInUp}
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
			</Animated.View>
		</TouchableOpacity>
	);
});

const styles = StyleSheet.create({
	choiceText: {
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		fontSize: 14,
		marginLeft: 6,
		opacity: 0.87,
	},
	choiceTextDescription: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		fontSize: 12.5,
		marginLeft: 6,
	},
	choiceContainer: {
		backgroundColor: '#424242',
		padding: 6,
		paddingHorizontal: 8,
		borderRadius: 8,
		minWidth: 104,
		alignItems: 'center',
		flexDirection: 'row',
	},
	choiceContainerWithDesc: {
		backgroundColor: '#202020',
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
