import { ActivityIndicator, View } from 'react-native';
import { useRealm } from '@realm/react';
import { Button } from '@rneui/themed';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import { Text } from '@rneui/themed';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { AppButtonVariantA } from '../../../lib/Buttons';
import { useState } from 'react';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import { formatRelative } from 'date-fns';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import useSyncWithProgress, {
	ACTIVITYPUB_SYNC_TASK,
} from '../../../hooks/tasks/useSyncWithProgress';
import BookmarkGalleryAdvanced from '../../../dialogs/BookmarkGalleryAdvanced';

function BookmarkNeverSyncedPrompt() {
	const { Task, IsTaskRunning, Numerator } = useSyncWithProgress(
		ACTIVITYPUB_SYNC_TASK.BOOKMARK_SYNC,
		{},
	);

	async function onSyncBookmarks() {
		if (!IsTaskRunning) {
			Task();
		}
	}

	return (
		<View>
			<Text style={{ textAlign: 'center' }}>
				Perform a one-time sync to browse your bookmarks offline and other
				gallery features.
			</Text>
			<View style={{ marginTop: 16, marginBottom: 4 }}>
				<AppButtonVariantA
					label={'Sync Now'}
					onClick={onSyncBookmarks}
					loading={IsTaskRunning}
					opts={{ useHaptics: true }}
					customLoadingState={
						<View style={{ display: 'flex', flexDirection: 'row' }}>
							<Text>{Numerator}/?</Text>
							<ActivityIndicator
								size={20}
								color={'white'}
								style={{ marginLeft: 8 }}
							/>
						</View>
					}
				/>
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_HEADER,
						fontSize: 12,
						marginLeft: 4,
					}}
				>
					Last Synced: Never
				</Text>
			</View>
		</View>
	);
}

function BookmarkSyncedPrompt() {
	const { primaryAcct } = useActivityPubRestClientContext();
	const [
		BookmarkGallerySettingDialogVisible,
		setBookmarkGallerySettingDialogVisible,
	] = useState(false);

	function onBookmarkGalleryBrowseClick() {
		router.navigate('/favourites/bookmark-gallery');
	}

	return (
		<View>
			<View style={{ marginVertical: 8 }}>
				<Text style={{ textAlign: 'left', paddingHorizontal: 8 }}>
					A better interface to browse your bookmarks.
				</Text>
				<View style={{ marginTop: 8, paddingHorizontal: 16 }}>
					<Text>- ✨ Offline Support</Text>
					<Text>- ✨ Full-text search</Text>
					<Text>- Private bookmarks</Text>
				</View>
			</View>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					marginTop: 16,
					alignItems: 'center',
				}}
			>
				<View style={{ flexGrow: 1 }}>
					<AppButtonVariantA
						label={'Take me There'}
						onClick={onBookmarkGalleryBrowseClick}
						loading={false}
					/>
				</View>
				<View
					style={{ marginLeft: 12, marginRight: 4 }}
					onTouchStart={() => {
						setBookmarkGallerySettingDialogVisible(true);
					}}
				>
					<FontAwesome5
						name="cog"
						size={24}
						color={APP_FONT.MONTSERRAT_HEADER}
					/>
				</View>
			</View>
			<Text
				style={{
					color: APP_FONT.MONTSERRAT_HEADER,
					fontSize: 12,
					marginLeft: 4,
					marginTop: 4,
				}}
			>
				Last Synced:{' '}
				{formatRelative(new Date(), primaryAcct?.bookmarksLastSyncedAt)}
			</Text>
			<BookmarkGalleryAdvanced
				IsVisible={BookmarkGallerySettingDialogVisible}
				setIsVisible={setBookmarkGallerySettingDialogVisible}
			/>
			{/*<View style={{ marginTop: 16 }}></View>*/}
		</View>
	);
}

function BookmarkPortalStack() {
	const { primaryAcct } = useActivityPubRestClientContext();
	const db = useRealm();
	return (
		<WithAutoHideTopNavBar title={'Bookmark Viewer'}>
			<View
				style={{
					borderWidth: 2,
					borderColor: '#383838',
					borderRadius: 8,
					padding: 8,
					margin: 8,
				}}
			>
				<Text
					style={{
						textAlign: 'center',
						fontFamily: 'Montserrat-Bold',
						fontSize: 20,
					}}
				>
					Bookmark Gallery
					<MaterialCommunityIcons
						name="beta"
						size={24}
						color={APP_THEME.COLOR_SCHEME_D_NORMAL}
					/>
				</Text>

				{!primaryAcct.bookmarksLastSyncedAt ? (
					<BookmarkNeverSyncedPrompt />
				) : (
					<BookmarkSyncedPrompt />
				)}
			</View>
			<View>
				<Button>Just take me to the Simple View</Button>
			</View>
		</WithAutoHideTopNavBar>
	);
}

export default BookmarkPortalStack;
