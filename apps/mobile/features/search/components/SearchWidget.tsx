import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { Dimensions, Pressable, StyleSheet, TextInput } from 'react-native';
import { useRef, useState } from 'react';
import { useAppTheme } from '#/states/global/hooks';
import { Feather } from '@expo/vector-icons';
import { APP_FONTS } from '#/styles/AppFonts';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const BUTTON_SIZE = 50;

type SearchWidgetProps = {
	SearchTerm: string;
	setSearchTerm: (term: string) => void;
	onSearch: () => void;
};

function SearchWidget({
	SearchTerm,
	setSearchTerm,
	onSearch,
}: SearchWidgetProps) {
	const isRotated = useSharedValue(0);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	const MAX_WIDTH = Dimensions.get('window').width;
	const CONTAINER_PADDING = 24;
	const WIDGET_MAX_WIDTH = MAX_WIDTH;
	const textInputRef = useRef<TextInput>(null);

	const [IsWidgetExpanded, setIsWidgetExpanded] = useState(false);
	const rotation = useSharedValue(0);
	const containerWidth = useSharedValue(0);
	const borderRadius = useSharedValue(16);

	function submitSearch() {
		onSearch();
		toggleMenu(false);
	}

	/**
	 * --------
	 */

	function toggleMenu(isOpened?: boolean) {
		let NEXT_IS_OPENED = !IsWidgetExpanded;

		if (isOpened !== undefined) NEXT_IS_OPENED = isOpened;

		if (NEXT_IS_OPENED) {
			rotation.value = withTiming(45, { duration: 200 });
			isRotated.value = withTiming(1, { duration: 0 });
			containerWidth.value = withTiming(WIDGET_MAX_WIDTH, { duration: 200 });
			borderRadius.value = withTiming(16, { duration: 300 });
		} else {
			//To make it less wonky as the input closes
			setTimeout(() => {
				rotation.value = withTiming(0, { duration: 200 });
				containerWidth.value = withTiming(64, { duration: 200 });
				isRotated.value = withTiming(0, { duration: 0 });
				borderRadius.value = withTiming(16, { duration: 300 });
			}, 260);
		}

		if (NEXT_IS_OPENED) {
			setTimeout(() => {
				textInputRef.current?.focus();
			}, 200);
		} else {
			textInputRef.current?.blur();
		}
		setIsWidgetExpanded(NEXT_IS_OPENED);
	}

	const containerStyle = useAnimatedStyle(() => {
		return {
			width: interpolate(
				containerWidth.value,
				[64, WIDGET_MAX_WIDTH],
				[BUTTON_SIZE, WIDGET_MAX_WIDTH],
				Extrapolation.CLAMP,
			),
			borderRadius: borderRadius.value,
			right: isRotated.value
				? withTiming(0, { duration: 300 })
				: withTiming(CONTAINER_PADDING, { duration: 180 }),
		};
	});

	const rootStyle = useAnimatedStyle(() => {
		return {
			bottom: isRotated.value
				? withTiming(0, { duration: 300 })
				: withTiming(64, { duration: 180 }),
		};
	});

	const { theme } = useAppTheme();
	return (
		<Animated.View style={[styles.root, rootStyle]}>
			{/*{IsWidgetExpanded && <WidgetExpanded />}*/}
			<Animated.View
				style={[
					styles.button,
					containerStyle,
					{
						flexDirection: 'row',
						paddingLeft: IsWidgetExpanded ? 6 : 0,
						backgroundColor:
							!IsWidgetExpanded && !!SearchTerm
								? 'rgba(160, 160, 160, 0.28)'
								: theme.primary,
						// right: CONTAINER_PADDING,
						borderRadius: 16,
					},
				]}
			>
				<AnimatedPressable
					style={{ padding: 8 }}
					onPress={() => {
						toggleMenu();
					}}
				>
					<Feather
						name="search"
						color={
							!IsWidgetExpanded && !!SearchTerm
								? 'rgba(0, 0, 0, 0.36)'
								: 'black'
						}
						size={25}
					/>
				</AnimatedPressable>
				{IsWidgetExpanded && (
					<TextInput
						ref={textInputRef}
						multiline={false}
						placeholderTextColor={'rgba(0, 0, 0, 0.84)'}
						onChangeText={setSearchTerm}
						onSubmitEditing={submitSearch}
						value={SearchTerm}
						placeholder={t(`discover.welcome`)}
						style={[
							{
								paddingLeft: 4,
								flex: 1,
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
							},
						]}
						numberOfLines={1}
					/>
				)}
			</Animated.View>
		</Animated.View>
	);
}

export default SearchWidget;

const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		bottom: 0, // 32
		width: '100%',
	},
	container: {
		flexDirection: 'row',
		zIndex: 5,
	},
	button: {
		width: BUTTON_SIZE,
		height: BUTTON_SIZE,
		borderRadius: BUTTON_SIZE / 2,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(1,123,254,1)', // position
		alignSelf: 'flex-end',
	},
	actionButton: {
		width: BUTTON_SIZE,
		height: BUTTON_SIZE,
		borderRadius: BUTTON_SIZE / 2,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
	},
});
