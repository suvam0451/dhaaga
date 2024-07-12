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
import { memo, useRef, useState } from 'react';
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

const TagSelectionListHeaderComponent = memo(function Foo() {
	return (
		<View style={{ display: 'flex', flexDirection: 'row' }}>
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
		</View>
	);
});

const UserSelectionListHeaderComponent = memo(function Foo() {
	const {
		IsUserNoneSelected,
		IsUserAllSelected,
		onUserAllSelected,
		onUserNoneSelected,
	} = useBookmarkGalleryControllerContext();

	return (
		<View style={{ display: 'flex', flexDirection: 'row' }}>
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
		</View>
	);
});

/**
 * This is the Bookmark Gallery Widget
 *
 * It shows the aggregated counts per-user
 * and allows filtering/searching for the module
 */
const BookmarkGalleryWidgetExpanded = memo(function Foo() {
	const {
		loadedUserData,
		loadedTagData,
		isBuilding,
		isUserSelected,
		onUserSelected,
		postsTotalCount,
		usersTotalCount,
	} = useBookmarkGalleryControllerContext();

	const DeviceWidth = useRef(Dimensions.get('window').width);

	const [IsExpanded, setIsExpanded] = useState(false);
	if (!IsExpanded)
		return <BookmarkGalleryWidgetCollapsed expand={setIsExpanded} />;

	function onCollapsePress() {
		setIsExpanded(false);
	}

	if (isBuilding) return <BookmarkGalleryWidgetSkeleton />;

	return (
		<View style={[styles.widgetContainerExpanded]}>
			<View style={[styles.widgetContainerExpandedInternal]}>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						width: '100%',
					}}
				>
					<View style={{ flexGrow: 1, paddingVertical: 4 }}>
						<Text
							style={{
								color: APP_FONT.MONTSERRAT_BODY,
								fontSize: 13,
								fontFamily: 'Montserrat-Bold',
								marginLeft: 4,
							}}
						>
							{postsTotalCount} Posts from {usersTotalCount} users.
						</Text>
					</View>
					<View style={{ display: 'flex', flexDirection: 'row' }}>
						<View
							style={{
								marginRight: 16,
								paddingVertical: 8,
							}}
						>
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
								paddingVertical: 8,
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

				<AnimatedFlashList
					ListHeaderComponent={UserSelectionListHeaderComponent}
					horizontal={true}
					estimatedItemSize={48}
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

				<AnimatedFlashList
					ListHeaderComponent={TagSelectionListHeaderComponent}
					horizontal={true}
					estimatedItemSize={72}
					data={loadedTagData}
					estimatedListSize={{
						width: DeviceWidth.current,
						height: 32,
					}}
					contentContainerStyle={{ paddingBottom: 8 }}
					renderItem={({ item }) => (
						<RealmTag
							onPress={() => {}}
							dto={{
								name: item.tag.name,
								following: item.tag.following,
								privatelyFollowing: item.tag.privatelyFollowing,
							}}
							count={item.count}
						/>
					)}
				/>
			</View>
		</View>
	);
});

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
		width: '100%',
		position: 'absolute',
		bottom: 0,
	},
	widgetContainerExpandedInternal: {
		marginHorizontal: 12,
		backgroundColor: 'rgba(54,54,54,0.87)',
		marginBottom: 8,
		display: 'flex',
		borderRadius: 16,
		padding: 8,
		paddingBottom: 0,
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
	tagItemContainer: {},
	tagSelectionBoxSpecial: {
		backgroundColor: 'rgba(240,185,56,0.16)',
		margin: 4,
		padding: 4,
		paddingHorizontal: 12,
		borderRadius: 4,
		flexShrink: 1,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		height: 30,
	},
});

export default BookmarkGalleryWidgetExpanded;
