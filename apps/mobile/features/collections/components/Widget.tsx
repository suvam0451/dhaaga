import { FlatList, StyleSheet, View } from 'react-native';
import { AppText } from '../../../components/lib/Text';
import { appDimensions } from '../../../styles/dimensions';
import { APP_FONTS } from '../../../styles/AppFonts';
import { AppIcon } from '../../../components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { Image } from 'expo-image';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { useCollectionViewState } from '../contexts/CollectionViewCtx';

function Widget() {
	const { theme } = useAppTheme();
	const state = useCollectionViewState();

	return (
		<View
			style={{
				position: 'absolute',
				width: '100%',
				bottom: 4,
			}}
		>
			<View
				style={{
					marginHorizontal: 10,
					paddingVertical: 12,
					paddingTop: 8,
					borderRadius: 12,
					backgroundColor: theme.background.a30,
					paddingHorizontal: 10,
					position: 'relative',
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						marginBottom: 4,
					}}
				>
					<View
						style={{
							flexGrow: 1,
							alignSelf: 'center',
							marginTop: 10,
						}}
					>
						<AppText.SemiBold
							style={{
								color: theme.primary.a0,
								marginBottom: appDimensions.timelines.sectionBottomMargin * 4,
								fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
								fontSize: 16,
							}}
						>
							{state.results.length} posts from {state.users.length} users
						</AppText.SemiBold>
					</View>
					<View
						style={{
							alignSelf: 'flex-start',
						}}
					>
						<AppIcon
							id={'chevron-down-circle'}
							containerStyle={{ paddingHorizontal: 8, paddingVertical: 6 }}
							size={32}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
						/>
					</View>
				</View>
				<FlatList
					horizontal={true}
					data={state.users}
					ListHeaderComponent={() => (
						<View style={{ flexDirection: 'row' }}>
							<View
								style={[
									styles.userContainer,
									{
										borderColor: state.all
											? theme.primary.a0
											: theme.secondary.a50,
									},
								]}
							>
								<View
									style={{
										width: 64,
										height: 64,
										borderRadius: 12,
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<AppText.Medium
										style={{
											textAlign: 'center',
											color: state.none
												? theme.primary.a0
												: theme.secondary.a10,
										}}
									>
										ALL
									</AppText.Medium>
								</View>
							</View>

							<View
								style={[
									styles.userContainer,
									{
										borderColor: state.none
											? theme.primary.a0
											: theme.secondary.a50,
									},
								]}
							>
								<View
									style={{
										width: 64,
										height: 64,
										borderRadius: 12,
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<AppText.SemiBold
										style={{
											textAlign: 'center',
											color: state.none
												? theme.primary.a0
												: theme.secondary.a10,
										}}
									>
										NONE
									</AppText.SemiBold>
								</View>
							</View>
						</View>
					)}
					renderItem={({ item }) => (
						<View style={{ marginHorizontal: 4 }}>
							{/*@ts-ignore-next-line*/}
							<Image
								source={{ uri: item.item.avatarUrl }}
								style={{ width: 64, height: 64, borderRadius: 12 }}
							/>
						</View>
					)}
					contentContainerStyle={{
						paddingBottom: 8,
					}}
				/>
			</View>
		</View>
	);
}

export default Widget;

const styles = StyleSheet.create({
	userContainer: {
		marginHorizontal: 4,
		borderWidth: 2,
		borderRadius: 12,
	},
});
