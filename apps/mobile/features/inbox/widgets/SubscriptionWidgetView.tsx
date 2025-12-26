import { NativeTextMedium } from '#/ui/NativeText';
import { appDimensions } from '#/styles/dimensions';
import { Dimensions, FlatList, View, StyleSheet } from 'react-native';
import { useSubscriptionGalleryState } from '@dhaaga/react';
import { useAppTheme } from '#/states/global/hooks';
import { Image } from 'expo-image';

type Props = {
	visible: boolean;
};

function SubscriptionWidgetView({ visible }: Props) {
	const State = useSubscriptionGalleryState();
	const { theme } = useAppTheme();

	if (!visible) return <View />;
	return (
		<View style={{ flex: 1, backgroundColor: theme.background.a10 }}>
			<FlatList
				data={State.users}
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					marginVertical: 8,
					flex: 1,
				}}
				style={{
					flex: 1,
					width: Dimensions.get('window').width,
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
							<NativeTextMedium
								style={{
									margin: 'auto',
									color: State.allSelected
										? theme.primary
										: theme.complementary,
								}}
							>
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
			<View
				style={{
					flex: 1,
					height: appDimensions.bottomNav.secondMenuBarHeight,
					alignItems: 'center',
				}}
			>
				{visible ? (
					<NativeTextMedium
						style={{ color: theme.complementary, margin: 'auto' }}
					>
						Showing {State.items.length} updates from {State.userSelection.size}{' '}
						users
					</NativeTextMedium>
				) : (
					<View />
				)}
			</View>
		</View>
	);
}

export default SubscriptionWidgetView;

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
