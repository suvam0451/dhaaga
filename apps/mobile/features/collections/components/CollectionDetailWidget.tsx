import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '#/components/lib/Text';
import { appDimensions } from '#/styles/dimensions';
import { APP_FONTS } from '#/styles/AppFonts';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { Image } from 'expo-image';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { useCollectionDetailState } from '../contexts/CollectionDetailCtx';

type ControlHeadersProps = {
	allSelected: boolean;
	noneSelected: boolean;
	onAllSelect: () => void;
	onNoneSelect: () => void;
};

function ControlHeaders({
	allSelected,
	noneSelected,
	onAllSelect,
	onNoneSelect,
}: ControlHeadersProps) {
	const { theme } = useAppTheme();

	return (
		<View style={{ flexDirection: 'row' }}>
			<TouchableOpacity
				style={[
					styles.userContainer,
					{
						borderColor: allSelected ? theme.primary.a0 : theme.secondary.a50,
					},
				]}
				onPress={onAllSelect}
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
							color: allSelected ? theme.primary.a0 : theme.secondary.a10,
						}}
					>
						ALL
					</AppText.Medium>
				</View>
			</TouchableOpacity>

			<TouchableOpacity
				style={[
					styles.userContainer,
					{
						borderColor: noneSelected ? theme.primary.a0 : theme.secondary.a50,
					},
				]}
				onPress={onNoneSelect}
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
							color: noneSelected ? theme.primary.a0 : theme.secondary.a10,
						}}
					>
						NONE
					</AppText.SemiBold>
				</View>
			</TouchableOpacity>
		</View>
	);
}

function CollectionDetailWidget() {
	const { theme } = useAppTheme();
	const state = useCollectionDetailState();

	return (
		<View style={[styles.root]}>
			<View
				style={[
					styles.container,
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
					ListHeaderComponent={
						<ControlHeaders
							allSelected={state.all}
							noneSelected={state.none}
							onAllSelect={() => {}}
							onNoneSelect={() => {}}
						/>
					}
					renderItem={({ item }) => (
						<View style={{ marginHorizontal: 4 }}>
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

export default CollectionDetailWidget;

const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		width: '100%',
		bottom: 4,
	},
	container: {
		marginHorizontal: 6,
		paddingVertical: 4,
		paddingTop: 8,
		borderRadius: 12,
		paddingHorizontal: 10,
	},
	userContainer: {
		marginHorizontal: 4,
		borderWidth: 2,
		borderRadius: 12,
	},
});
