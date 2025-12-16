import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import { memo, useState } from 'react';
import { APP_FONT, APP_THEME } from '#/styles/AppTheme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import useSyncWithProgress, {
	ACTIVITYPUB_SYNC_TASK,
} from '#/features/_archived/bookmark-gallery/components/useSyncWithProgress';
import { APP_FONTS } from '#/styles/AppFonts';
import NavBar_Simple from '#/components/shared/topnavbar/NavBar_Simple';

export function BookmarkNeverSyncedPrompt() {
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
			<Text
				style={{
					textAlign: 'center',
					fontFamily: APP_FONTS.INTER_500_MEDIUM,
					color: APP_FONT.MONTSERRAT_BODY,
					marginTop: 16,
				}}
			>
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
							<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
								{Numerator}/?
							</Text>
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
						color: APP_FONT.MONTSERRAT_BODY,
						fontSize: 12,
						marginLeft: 4,
						marginTop: 6,
					}}
				>
					Last Synced: Never
				</Text>
			</View>
		</View>
	);
}

export function BookmarkSyncedPrompt() {
	const [
		BookmarkGallerySettingDialogVisible,
		setBookmarkGallerySettingDialogVisible,
	] = useState(false);

	function onBookmarkGalleryBrowseClick() {
		router.navigate('/apps/bookmark-gallery');
	}

	return (
		<View>
			<View style={{ marginVertical: 8 }}>
				<Text
					style={{
						textAlign: 'center',
						paddingHorizontal: 8,
						color: APP_FONT.MONTSERRAT_BODY,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
						marginVertical: 6,
					}}
				>
					Browse your bookmarks with style.
				</Text>
				<View style={{ marginTop: 8, paddingHorizontal: 16 }}>
					<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
						✨ Offline Support
					</Text>
					<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
						✨ Filter by Account
					</Text>
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
					<FontAwesome5 name="cog" size={24} color={APP_FONT.MONTSERRAT_BODY} />
				</View>
			</View>
			<Text
				style={{
					color: APP_FONT.MONTSERRAT_BODY,
					fontSize: 12,
					marginLeft: 4,
					marginTop: 4,
				}}
			>
				Last Synced: {/*{primaryAcct?.bookmarksLastSyncedAt*/}
				{/*	? formatRelative(new Date(), primaryAcct?.bookmarksLastSyncedAt)*/}
				{/*	: ''}*/}
			</Text>
			{/*<BookmarkGalleryAdvanced*/}
			{/*	IsVisible={BookmarkGallerySettingDialogVisible}*/}
			{/*	setIsVisible={setBookmarkGallerySettingDialogVisible}*/}
			{/*/>*/}
		</View>
	);
}

const BookmarkPortalStack = memo(() => {
	// const acct = useObject(Account, PrimaryAcctPtr.current);

	const BOOKMARK_LAST_SYNCED_AT = null;
	// acct?.isValid()
	// 	? acct?.bookmarksLastSyncedAt
	// 	: null;

	return (
		<>
			<NavBar_Simple label={'Bookmark Viewer'} />
			<View style={style.sectionContainer}>
				<Text style={style.texStyle}>
					Bookmark Gallery
					<MaterialCommunityIcons
						name="beta"
						size={24}
						color={APP_THEME.COLOR_SCHEME_D_NORMAL}
					/>
				</Text>

				{!BOOKMARK_LAST_SYNCED_AT ? (
					<BookmarkNeverSyncedPrompt />
				) : (
					<BookmarkSyncedPrompt />
				)}
			</View>
			<View style={style.sectionContainer}>
				<Text style={style.texStyle}>Classic View</Text>
				<AppButtonVariantA
					label={'Take me There'}
					onClick={() => {
						router.navigate('/favourites/bookmark-classic');
					}}
					loading={false}
				/>
			</View>
		</>
	);
});

const style = StyleSheet.create({
	sectionContainer: {
		borderWidth: 2,
		borderColor: '#383838',
		borderRadius: 8,
		padding: 8,
		margin: 8,
	},
	texStyle: {
		textAlign: 'center',
		fontFamily: 'Montserrat-Bold',
		fontSize: 20,
		color: APP_FONT.MONTSERRAT_BODY,
	},
});

export default BookmarkPortalStack;
