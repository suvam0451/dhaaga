import Animated, {
	useAnimatedStyle,
	withTiming,
} from 'react-native-reanimated';
import { appDimensions } from '#/styles/dimensions';
import { useAppTheme } from '#/states/global/hooks';
import { useState } from 'react';
import {
	Dimensions,
	FlatList,
	Pressable,
	View,
	StyleSheet,
} from 'react-native';
import { AppDividerSoft } from '#/ui/Divider';
import {
	useSubscriptionGalleryDispatch,
	useSubscriptionGalleryState,
} from '@dhaaga/react';
import { AppIcon } from '#/components/lib/Icon';
import { Image } from 'expo-image';
import { NativeTextMedium } from '#/ui/NativeText';

function SubscriptionGalleryWidget() {
	const [WidgetOpen, setWidgetOpen] = useState(false);
	const { theme } = useAppTheme();

	const State = useSubscriptionGalleryState();
	const dispatch = useSubscriptionGalleryDispatch();

	const MIN_WIDTH = 52;
	const MAX_WIDTH = Dimensions.get('window').width;

	/**
	 * Animations
	 */

	const textInputAreaStyle = useAnimatedStyle(() => {
		return {
			width: withTiming(WidgetOpen ? MAX_WIDTH : 0, { duration: 200 }),
			borderTopStartRadius: WidgetOpen ? 8 : 16,
			borderBottomStartRadius: WidgetOpen ? 8 : 16,
		};
	});

	const filterAreaStyle = useAnimatedStyle(() => {
		return {
			width: withTiming(WidgetOpen ? MAX_WIDTH : MIN_WIDTH, { duration: 200 }),
		};
	});

	function onPress() {
		setWidgetOpen((o) => !o);
	}

	return (
		<>
			<Animated.View
				style={[
					{
						position: 'absolute',
						bottom: appDimensions.bottomNav.secondMenuBarHeight,
						zIndex: 1,
						backgroundColor: theme.background.a10,
						flex: 1,
						width: '100%',
						right: 0,
					},
					textInputAreaStyle,
				]}
			>
				<AppDividerSoft
					style={{
						backgroundColor: theme.background.a50,
					}}
				/>
				<FlatList
					data={State.users}
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						marginVertical: 8,
					}}
					renderItem={({ item }) => (
						<View
							style={[
								styles.avatarContainer,
								{
									borderColor: State.noneSelected
										? theme.primary
										: theme.complementary,
								},
							]}
						>
							<Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
						</View>
					)}
					ListHeaderComponent={
						<View style={{ flexDirection: 'row' }}>
							<View
								style={[
									styles.avatarContainer,
									{
										borderColor: State.allSelected
											? theme.primary
											: theme.complementary,
									},
								]}
							>
								<NativeTextMedium style={{ margin: 'auto' }}>
									ALL
								</NativeTextMedium>
							</View>
							<View
								style={[
									styles.avatarContainer,
									{
										borderColor: State.noneSelected
											? theme.primary
											: theme.complementary,
									},
								]}
							>
								<NativeTextMedium style={{ margin: 'auto' }}>
									NONE
								</NativeTextMedium>
							</View>
						</View>
					}
				/>
			</Animated.View>
			<Animated.View
				style={[
					{
						width: 72,
						position: 'absolute',
						zIndex: 1000000000,
						bottom: 0,
						right: 0,
						height: appDimensions.bottomNav.secondMenuBarHeight,
						backgroundColor: theme.background.a10,
						flexDirection: 'row',
					},
					filterAreaStyle,
				]}
			>
				<View style={{ flex: 1, alignItems: 'center' }}>
					{WidgetOpen ? (
						<NativeTextMedium
							style={{ color: theme.complementary, margin: 'auto' }}
						>
							Showing {State.items.length} updates from{' '}
							{State.userSelection.size} users
						</NativeTextMedium>
					) : (
						<View />
					)}
				</View>
				<Pressable
					onPress={onPress}
					style={{
						paddingVertical: 12,
						paddingHorizontal: 12,
						borderTopStartRadius: 16,
						borderBottomStartRadius: 16,
						borderTopEndRadius: 4,
						borderBottomEndRadius: 4,
						backgroundColor: theme.primary,
					}}
				>
					<AppIcon id={'filter-outline'} color={'black'} />
				</Pressable>
			</Animated.View>
		</>
	);
}

export default SubscriptionGalleryWidget;

const styles = StyleSheet.create({
	avatarContainer: {
		width: 64,
		height: 64,
		marginHorizontal: 4,
		borderRadius: 32,
		borderWidth: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatar: {
		width: 60,
		height: 60,
		borderRadius: 30,
	},
});
