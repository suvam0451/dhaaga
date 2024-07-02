import {
	ScrollView,
	View,
	StyleSheet,
	ViewStyle,
	TouchableOpacity,
} from 'react-native';
import { Text } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import { Image } from 'expo-image';
import { useBookmarkGalleryControllerContext } from '../../../../states/useBookmarkGalleryController';
import { AnimatedFlashList } from '@shopify/flash-list';
import { useState } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import RealmTag from '../../../common/tag/RealmTag';

const USER_SELECTION_BUBBLE_SIZE = 54;

function BookmarkGalleryWidgetCollapsed({
	expand,
}: {
	expand: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	function onPress() {
		expand(true);
	}

	return (
		<TouchableOpacity style={styles.widgetContainerCollapsed} onPress={onPress}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					width: '100%',
					justifyContent: 'center',
					padding: 12,
					paddingVertical: 16,
				}}
			>
				<View style={{ width: 24 }}>
					<FontAwesome5
						name="filter"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				</View>
			</View>
		</TouchableOpacity>
	);
}

/**
 * This is the Bookmark Gallery Widget
 *
 * It shows the aggregated counts per-user
 * and allows filtering/searching for the module
 */
function BookmarkGalleryWidgetExpanded() {
	const { acct, loadedUserData, loadedTagData, isBuilding, isRefreshing } =
		useBookmarkGalleryControllerContext();

	const [IsExpanded, setIsExpanded] = useState(true);
	if (!IsExpanded)
		return <BookmarkGalleryWidgetCollapsed expand={setIsExpanded} />;

	function onCollapsePress() {
		setIsExpanded(false);
	}

	return (
		<View style={styles.widgetContainerExpanded}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					width: '100%',
					marginVertical: 16,
				}}
			>
				<View style={{ flexGrow: 1 }}>
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
							fontSize: 13,
							fontFamily: 'Inter',
						}}
					>
						{acct.bookmarks.length} Posts from {loadedUserData.length} users.
					</Text>
				</View>
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<View style={{ marginRight: 16 }}>
						<FontAwesome
							name="search"
							size={24}
							color={APP_FONT.MONTSERRAT_BODY}
							style={{ opacity: 0.3 }}
						/>
					</View>

					<View style={{ marginRight: 8 }}>
						<FontAwesome
							name="chevron-down"
							size={24}
							color={APP_FONT.MONTSERRAT_BODY}
							onPress={onCollapsePress}
						/>
					</View>
				</View>
			</View>

			<ScrollView horizontal style={{ height: 60, marginTop: 8 }}>
				<View style={styles.userSelectionBoxSpecial}>
					<Text
						style={{
							textAlign: 'center',
							fontFamily: 'Montserrat-Bold',
							color: APP_FONT.MONTSERRAT_HEADER,
						}}
					>
						ALL
					</Text>
				</View>
				<View style={styles.userSelectionBoxSpecial}>
					<Text
						style={{
							textAlign: 'center',
							fontFamily: 'Montserrat-Bold',
							color: APP_FONT.MONTSERRAT_HEADER,
						}}
					>
						NONE
					</Text>
				</View>
				<AnimatedFlashList
					horizontal={true}
					estimatedItemSize={32}
					data={loadedUserData}
					renderItem={(o) => (
						<View key={o.index}>
							<View style={styles.userSelectionBox}>
								{/*@ts-ignore-next-line*/}
								<Image
									source={o.item.user.avatarUrl}
									style={{
										flex: 1,
										width: '100%',
										borderRadius: 4,
										padding: 2,
									}}
								/>
								<View
									style={{
										position: 'absolute',
										zIndex: 99,
										right: '100%',
										bottom: 0,
										left: 0,
										backgroundColor: 'red',
									}}
								>
									<View
										style={{
											position: 'relative',
											width: '100%',
										}}
									>
										<View
											style={{
												position: 'absolute',
												left: -0,
												bottom: 0,
												display: 'flex',
												flexDirection: 'row',
												width: 52,
											}}
										>
											<View style={{ flexGrow: 1 }}></View>
											<View
												style={{
													backgroundColor: 'rgba(100,100, 100, 0.75)',
													borderRadius: 8,
													borderBottomRightRadius: 4,
													borderBottomLeftRadius: 0,
													borderTopRightRadius: 0,
													paddingHorizontal: 8,
												}}
											>
												<Text
													style={{
														textAlign: 'center',
														color: APP_FONT.MONTSERRAT_HEADER,
														fontSize: 12,
													}}
												>
													{o.item.count}
												</Text>
											</View>
										</View>
									</View>
								</View>
							</View>
						</View>
					)}
				/>
			</ScrollView>

			<ScrollView horizontal style={{ height: 40, marginTop: 16 }}>
				<View style={styles.tagSelectionBoxSpecial}>
					<Text
						style={{
							fontSize: 13,
							color: APP_THEME.COLOR_SCHEME_D_EMPHASIS,
							fontFamily: 'Montserrat-Bold',
						}}
					>
						ALL
					</Text>
				</View>
				<View style={styles.tagSelectionBoxSpecial}>
					<Text
						style={{
							fontSize: 13,
							color: APP_THEME.COLOR_SCHEME_D_EMPHASIS,
							fontFamily: 'Montserrat-Bold',
						}}
					>
						NONE
					</Text>
				</View>

				<AnimatedFlashList
					horizontal={true}
					estimatedItemSize={100}
					data={loadedTagData}
					renderItem={(o) => (
						<View key={o.index} style={styles.tagItemContainer}>
							<RealmTag
								onPress={() => {}}
								dto={{
									name: o.item.tag.name,
									following: o.item.tag.following,
									privatelyFollowing: o.item.tag.privatelyFollowing,
								}}
								count={o.item.count}
							/>
							{/*<Text>#{o.item.tag.name}</Text>*/}
						</View>
					)}
				/>
			</ScrollView>
		</View>
	);
}

const base: ViewStyle = {
	height: USER_SELECTION_BUBBLE_SIZE,
	width: USER_SELECTION_BUBBLE_SIZE,
	marginRight: 8,
	position: 'relative',
	borderColor: 'gray',
	borderWidth: 2,
	borderRadius: 6,
};
const styles = StyleSheet.create({
	userSelectionBox: base,
	userSelectionBoxSpecial: {
		...base,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},

	//
	widgetContainerExpanded: {
		marginBottom: 64,
		backgroundColor: 'rgba(54,54,54,0.9)',
		display: 'flex',
		position: 'absolute',
		bottom: 0,
		right: 0,
		borderRadius: 16,
		// maxWidth: 64,
		marginHorizontal: 8,
		padding: 8,
	},
	widgetContainerCollapsed: {
		marginBottom: 64,
		backgroundColor: 'rgba(54,54,54,0.87)',
		display: 'flex',
		position: 'absolute',
		bottom: 0,
		right: 0,
		borderRadius: 16,
		maxWidth: 64,
		marginRight: 16,
	},

	// each tag item
	tagItemContainer: {
		// marginRight: 8,
		// backgroundColor: 'red',
		// borderRadius: 8,
		// padding: 8,
	},
	tagSelectionBoxSpecial: {
		backgroundColor: 'rgba(240,185,56,0.16)',
		margin: 4,
		padding: 4,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 4,
		flexShrink: 1,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		height: 30,
	},
});

export default BookmarkGalleryWidgetExpanded;
