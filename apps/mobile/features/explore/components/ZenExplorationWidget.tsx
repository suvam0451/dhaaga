import { getSearchTabs } from '@dhaaga/db';
import {
	DiscoverStateAction,
	useDiscoverDispatch,
	useDiscoverState,
} from '@dhaaga/core';
import { useAppApiClient, useAppTheme } from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';
import { AppIcon } from '#/components/lib/Icon';
import { APP_FONTS } from '#/styles/AppFonts';
import { useRef, useState } from 'react';
import {
	Dimensions,
	Pressable,
	TextInput,
	View,
	StyleSheet,
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	withTiming,
} from 'react-native-reanimated';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';
import AppSegmentedControl from '#/ui/AppSegmentedControl';

function ZenExplorationWidget() {
	const { driver } = useAppApiClient();
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	const State = useDiscoverState();
	const dispatch = useDiscoverDispatch();

	const navItems = driver
		? getSearchTabs(driver).map((o) => ({
				label: o,
				active: State.tab === o,
				onPress: () =>
					dispatch({
						type: DiscoverStateAction.SET_CATEGORY,
						payload: {
							tab: o,
						},
					}),
			}))
		: [];

	const TextRef = useRef<TextInput>(null);
	const [WidgetOpen, setWidgetOpen] = useState(false);
	const [SearchTerm, setSearchTerm] = useState(null);
	const MIN_WIDTH = 52;
	const MAX_WIDTH = Dimensions.get('window').width;

	/**
	 * Animations
	 */

	const textInputAreaStyle = useAnimatedStyle(() => {
		return {
			width: withTiming(WidgetOpen ? MAX_WIDTH : MIN_WIDTH, { duration: 200 }),
			borderTopEndRadius: WidgetOpen ? 8 : 16,
			borderBottomEndRadius: WidgetOpen ? 8 : 16,
		};
	});

	/**
	 * Functions
	 */

	function onSearchOpen() {
		const wasOpen = WidgetOpen;
		setWidgetOpen((o) => !o);

		if (!wasOpen) {
			setTimeout(() => TextRef.current?.focus(), 200);
		} else {
			setTimeout(() => TextRef.current?.blur(), 200);
		}
	}

	function onClearSearch() {
		setSearchTerm(null);
	}

	function onSearch() {
		setWidgetOpen(false);
		dispatch({
			type: DiscoverStateAction.SET_SEARCH,
			payload: {
				q: SearchTerm,
			},
		});
		dispatch({
			type: DiscoverStateAction.APPLY_SEARCH,
		});
	}

	return (
		<>
			<Animated.View
				style={[
					{
						marginVertical: 'auto',
						alignItems: 'center',
						borderRightWidth: 2,
						borderColor: theme.background.a50,
						backgroundColor: theme.primary,
						borderTopStartRadius: 4,
						borderBottomStartRadius: 4,
						marginRight: 6,
						flexDirection: 'row',
						zIndex: 100,
						height: appDimensions.bottomNav.secondMenuBarHeight,
					},
					textInputAreaStyle,
				]}
			>
				<Pressable
					style={{
						paddingVertical: 12,
						paddingHorizontal: 12,
						paddingRight: WidgetOpen ? 6 : 12,
						marginRight: WidgetOpen ? 0 : 6,
					}}
					onPress={onSearchOpen}
				>
					<AppIcon id={'search'} size={24} color={'black'} />
				</Pressable>
				<TextInput
					ref={TextRef}
					multiline={false}
					placeholder={t(`discover.welcome`)}
					value={SearchTerm}
					onChangeText={setSearchTerm}
					numberOfLines={1}
					placeholderTextColor={'rgba(0, 0, 0, 0.84)'}
					onSubmitEditing={onSearch}
					style={{
						flex: 1,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
						color: 'black',
					}}
				/>
				<Pressable
					style={{
						paddingVertical: 12,
						paddingHorizontal: 12,
						paddingRight: WidgetOpen ? 6 : 12,
						marginRight: WidgetOpen ? 0 : 6,
						display: WidgetOpen ? 'flex' : 'none',
					}}
					onPress={onClearSearch}
				>
					<AppIcon id={'clear'} color={'black'} />
				</Pressable>
			</Animated.View>
			<AppSegmentedControl
				items={navItems}
				ListFooterComponent={() => (
					<View style={{ backgroundColor: theme.primary, flex: 1 }}></View>
				)}
				ListHeaderComponent={() => (
					<View style={styles.exploreMenuItem}>
						<AppIcon id={'planet-outline'} />
					</View>
				)}
				paddingLeft={64}
			/>
		</>
	);
}

export default ZenExplorationWidget;

const styles = StyleSheet.create({
	icon: { paddingVertical: 12, paddingHorizontal: 12 },
	exploreMenuItem: {
		paddingVertical: 12,
		paddingRight: 12,
	},
});
