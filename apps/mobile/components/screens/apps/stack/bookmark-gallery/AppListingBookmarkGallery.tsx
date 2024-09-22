import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { APP_FONT, APP_THEME } from '../../../../../styles/AppTheme';
import {
	BookmarkNeverSyncedPrompt,
	BookmarkSyncedPrompt,
} from '../BookmarkPortalStack';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import { useObject } from '@realm/react';
import { Account } from '../../../../../entities/account.entity';
import { BSON } from 'realm';

const AppListingBookmarkGallery = memo(() => {
	const { PrimaryAcctPtr } = useActivityPubRestClientContext();
	const acct = null; // useObject(Account, PrimaryAcctPtr.current || new BSON.UUID());

	const BOOKMARK_LAST_SYNCED_AT = acct?.isValid()
		? acct?.bookmarksLastSyncedAt
		: null;

	return (
		<View style={style.root}>
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
	);
});

const style = StyleSheet.create({
	root: {
		borderWidth: 2,
		borderColor: '#383838',
		borderRadius: 8,
		padding: 8,
		margin: 8,
		marginVertical: 16,
	},
	texStyle: {
		textAlign: 'center',
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		fontSize: 20,
		color: APP_FONT.MONTSERRAT_BODY,
	},
	appFeaturesGridRow: {
		marginHorizontal: 8,
		marginBottom: 8,
		display: 'flex',
		flexDirection: 'row',
	},
});

export default AppListingBookmarkGallery;
