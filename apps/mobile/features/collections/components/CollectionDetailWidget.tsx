import { FlatList, StyleSheet, View } from 'react-native';
import { AppText } from '../../../components/lib/Text';
import { appDimensions } from '../../../styles/dimensions';
import { APP_FONTS } from '../../../styles/AppFonts';
import { AppIcon } from '../../../components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { Image } from 'expo-image';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { useCollectionDetailState } from '../contexts/CollectionDetailCtx';

function CollectionDetailWidget() {
	const { theme } = useAppTheme();
	const state = useCollectionDetailState();

	return (
		<View
			style={[
				styles.root,
				{
					backgroundColor: theme.background.a30,
				},
			]}
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
						marginTop: 4,
					}}
				>
					<AppText.SemiBold
						style={{
							color: theme.primary.a0,
							marginBottom: appDimensions.timelines.sectionBottomMargin,
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							fontSize: 16,
							marginLeft: 6,
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
						id={'chevron-down'}
						containerStyle={{ paddingHorizontal: 8, paddingVertical: 6 }}
						size={28}
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
										color: state.none ? theme.primary.a0 : theme.secondary.a10,
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
										color: state.none ? theme.primary.a0 : theme.secondary.a10,
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
	);
}

export default CollectionDetailWidget;

const styles = StyleSheet.create({
	root: {
		marginHorizontal: 6,
		paddingVertical: 4,
		paddingTop: 8,
		borderRadius: 12,
		paddingHorizontal: 10,
		position: 'relative',
		bottom: 4,
	},
	userContainer: {
		marginHorizontal: 4,
		borderWidth: 2,
		borderRadius: 12,
	},
});
