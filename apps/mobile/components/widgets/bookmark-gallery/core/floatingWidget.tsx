import {
	ScrollView,
	View,
	StyleSheet,
	ViewStyle,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import { Text } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import { useBookmarkGalleryControllerContext } from '../../../../states/useBookmarkGalleryController';
import { AnimatedFlashList } from '@shopify/flash-list';
import { useRef, useState } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import RealmTag from '../../../common/tag/RealmTag';
import BookmarkGalleryWidgetSkeleton from '../../../skeletons/widgets/BookmarkGalleryWidget';
import { UserSelectionIndicator } from './indicators';

const USER_SELECTION_BUBBLE_SIZE = 54;
const SELECTED_COLOR = APP_THEME.REPLY_THREAD_COLOR_SWATCH[1];
const SELECTED_COLOR_BG = 'rgba(172,196,46,0.25)';

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
	const {
		acct,
		loadedUserData,
		loadedTagData,
		isBuilding,
		isRefreshing,
		IsUserNoneSelected,
		IsUserAllSelected,
		isUserSelected,
		isTagSelected,
		onUserSelected,
		onTagSelected,
		onUserAllSelected,
		onUserNoneSelected,
		onTagAllSelected,
		onTagNoneSelected,
	} = useBookmarkGalleryControllerContext();

	const DeviceWidth = useRef(Dimensions.get('window').width);

	const [IsExpanded, setIsExpanded] = useState(true);
	if (!IsExpanded)
		return <BookmarkGalleryWidgetCollapsed expand={setIsExpanded} />;

	function onCollapsePress() {
		setIsExpanded(false);
	}

	if (isBuilding) return <BookmarkGalleryWidgetSkeleton />;

	return (
		<View style={styles.widgetContainerExpanded}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					width: '100%',
					// marginVertical: 16,
				}}
			>
				<View style={{ flexGrow: 1, paddingVertical: 16 }}>
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
					<View style={{ marginRight: 16, paddingVertical: 16 }}>
						<FontAwesome
							name="search"
							size={24}
							color={APP_FONT.MONTSERRAT_BODY}
							style={{ opacity: 0.3 }}
						/>
					</View>
					<View
						style={{
							paddingHorizontal: 8,
							paddingVertical: 16,
							borderRadius: 8,
						}}
						onTouchStart={onCollapsePress}
					>
						<FontAwesome
							name="chevron-down"
							size={24}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					</View>
				</View>
			</View>

			<ScrollView horizontal style={{ height: 60, marginTop: 8 }}>
				<View
					onTouchEnd={onUserAllSelected}
					style={[
						styles.userSelectionBoxSpecial,
						{
							borderColor: IsUserAllSelected ? SELECTED_COLOR : 'gray',
							backgroundColor: IsUserAllSelected
								? SELECTED_COLOR_BG
								: 'transparent',
						},
					]}
				>
					<Text
						style={[
							{
								textAlign: 'center',
								fontFamily: 'Montserrat-Bold',
								color: APP_FONT.MONTSERRAT_BODY,
							},
							{
								color: IsUserAllSelected
									? SELECTED_COLOR
									: APP_FONT.MONTSERRAT_BODY,
							},
						]}
					>
						ALL
					</Text>
				</View>
				<View
					style={[
						styles.userSelectionBoxSpecial,
						{
							borderColor: IsUserNoneSelected ? SELECTED_COLOR : 'gray',
							backgroundColor: IsUserNoneSelected
								? SELECTED_COLOR_BG
								: 'transparent',
						},
					]}
					onTouchEnd={onUserNoneSelected}
				>
					<Text
						style={[
							{
								textAlign: 'center',
								fontFamily: 'Montserrat-Bold',
								color: APP_FONT.MONTSERRAT_BODY,
							},
							{
								color: IsUserNoneSelected
									? SELECTED_COLOR
									: APP_FONT.MONTSERRAT_BODY,
							},
						]}
					>
						NONE
					</Text>
				</View>
				<AnimatedFlashList
					horizontal={true}
					estimatedItemSize={32}
					estimatedListSize={{
						width: DeviceWidth.current,
						height: 64,
					}}
					data={loadedUserData}
					renderItem={({ item }) => (
						<UserSelectionIndicator
							_id={item.user._id}
							count={item.count}
							onClick={() => {
								onUserSelected(item.user._id);
							}}
							isSelected={isUserSelected(item.user._id)}
							avatarUrl={item.user.avatarUrl}
						/>
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
					estimatedListSize={{
						width: DeviceWidth.current,
						height: 64,
					}}
					renderItem={({ item }) => (
						<View style={styles.tagItemContainer}>
							<RealmTag
								onPress={() => {}}
								dto={{
									name: item.tag.name,
									following: item.tag.following,
									privatelyFollowing: item.tag.privatelyFollowing,
								}}
								count={item.count}
							/>
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
		marginBottom: 8,
		backgroundColor: 'rgba(54,54,54,0.87)',
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
		marginBottom: 16,
		backgroundColor: 'rgba(54,54,54,0.85)',
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
