import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import {
	Dimensions,
	Pressable,
	StyleSheet,
	TextInput,
	View,
} from 'react-native';
import { useRef, useState } from 'react';
import {
	useDiscoverTabDispatch,
	useDiscoverTabState,
} from '../contexts/DiscoverTabCtx';
import { DiscoverTabReducerActionType } from '../reducers/discover-tab.reducer';
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { TextInputSubmitEditingEventData } from 'react-native/Libraries/Components/TextInput/TextInput';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { Loader } from '../../../components/lib/Loader';
import { Feather } from '@expo/vector-icons';
import { APP_FONTS } from '../../../styles/AppFonts';
import WidgetExpanded from './SearchResultFull';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const BUTTON_SIZE = 50;

function SearchWidget() {
	const isRotated = useSharedValue(0);
	const MAX_WIDTH = Dimensions.get('window').width;
	const CONTAINER_PADDING = 24;
	const WIDGET_MAX_WIDTH = MAX_WIDTH - CONTAINER_PADDING * 2;
	const textInputRef = useRef<TextInput>();

	const [IsWidgetExpanded, setIsWidgetExpanded] = useState(false);
	const rotation = useSharedValue(0);
	const containerWidth = useSharedValue(0);
	const borderRadius = useSharedValue(16);

	/**
	 * --- State Management ---
	 */
	const State = useDiscoverTabState();
	const dispatch = useDiscoverTabDispatch();

	const updateSearch = (search: string) => {
		dispatch({
			type: DiscoverTabReducerActionType.SET_SEARCH,
			payload: {
				q: search,
			},
		});
	};

	const submitSearch = (
		search: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
	) => {
		dispatch({
			type: DiscoverTabReducerActionType.APPLY_SEARCH,
		});
	};

	/**
	 * --------
	 */

	const toggleMenu = () => {
		const isExpanding = !IsWidgetExpanded;
		if (!isExpanding) textInputRef.current?.blur();
		setIsWidgetExpanded(!IsWidgetExpanded);

		if (isRotated.value === 0) {
			rotation.value = withTiming(45, { duration: 200 });
			isRotated.value = withTiming(1, { duration: 300 });
			containerWidth.value = withTiming(WIDGET_MAX_WIDTH, { duration: 200 });
			borderRadius.value = withTiming(16, { duration: 300 });
		} else {
			//To make it less wonky as the input closes
			setTimeout(() => {
				rotation.value = withTiming(0, { duration: 200 });
				containerWidth.value = withTiming(64, { duration: 200 });
				isRotated.value = withTiming(0, { duration: 300 });
				borderRadius.value = withTiming(50, { duration: 300 });
			}, 260);
		}
		if (isExpanding) {
			setTimeout(() => {
				textInputRef.current?.focus();
			}, 200);
		}
	};

	const containerStyle = useAnimatedStyle(() => {
		return {
			width: interpolate(
				containerWidth.value,
				[64, WIDGET_MAX_WIDTH],
				[BUTTON_SIZE, WIDGET_MAX_WIDTH],
				Extrapolation.CLAMP,
			),
			borderRadius: borderRadius.value,
		};
	});

	const { theme } = useAppTheme();
	return (
		<View style={styles.root}>
			{IsWidgetExpanded && <WidgetExpanded />}
			<Animated.View
				style={[
					styles.button,
					containerStyle,
					{
						flexDirection: 'row',
						paddingLeft: IsWidgetExpanded ? 6 : 0,
						backgroundColor: theme.primary.a0,
						right: CONTAINER_PADDING,
						borderRadius: 16,
					},
				]}
			>
				<AnimatedPressable style={{ padding: 8 }} onPress={toggleMenu}>
					{State.searchStatus === 'loading' ? (
						<Loader />
					) : (
						<Feather name="search" color={'black'} size={25} />
					)}
				</AnimatedPressable>
				{IsWidgetExpanded && (
					<TextInput
						ref={textInputRef}
						multiline={false}
						placeholderTextColor={'rgba(0, 0, 0, 0.84)'}
						onChangeText={updateSearch}
						onSubmitEditing={submitSearch}
						value={State.text}
						placeholder={'Discover something new!'}
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
		</View>
	);
}

export default SearchWidget;

const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		bottom: 20,
		width: '100%',
	},

	container: {
		flexDirection: 'row',
		zIndex: 5, // borderRadius: SIZE / 2,
		// backgroundColor: 'rgba(1,123,254,0.8)',
		// justifyContent: 'center',
		// alignItems: 'center',
		// position: 'absolute',
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
