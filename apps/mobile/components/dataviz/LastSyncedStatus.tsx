import { APP_FONT, APP_THEME } from '../../styles/AppTheme';
import { formatRelative } from 'date-fns';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import { Fragment, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { APP_FONTS } from '../../styles/AppFonts';

export enum LAST_SYNCED_STATUS_KEY {
	BOOKMARK_SYNC = 'BOOKMARK_SYNC',
	FAVOURITE_SYNC = 'FAVOURITE_SYNC',
	HASHTAG_SYNC = 'HASHTAG_SYNC',
}

type Props = {
	id: LAST_SYNCED_STATUS_KEY;
};

function LastSyncedStatus({ id }: Props) {
	const { primaryAcct } = useActivityPubRestClientContext();
	const [LastSyncedDate, setLastSyncedDate] = useState(null);
	const [TotalItemCount, setTotalItemCount] = useState(null);

	useEffect(() => {
		switch (id) {
			case LAST_SYNCED_STATUS_KEY.BOOKMARK_SYNC: {
				setLastSyncedDate(primaryAcct?.bookmarksLastSyncedAt);
				setTotalItemCount(primaryAcct.bookmarks.length);
				break;
			}
			case LAST_SYNCED_STATUS_KEY.FAVOURITE_SYNC: {
				setLastSyncedDate(primaryAcct?.favouritesLastSyncedAt);
				break;
			}
			case LAST_SYNCED_STATUS_KEY.HASHTAG_SYNC: {
				setLastSyncedDate(primaryAcct.hashtagsLastSyncedAt);
				break;
			}
			default: {
				setLastSyncedDate(null);
			}
		}
	}, [id, primaryAcct]);

	return (
		<Fragment>
			{LastSyncedDate ? (
				<Text style={styles.text}>
					Last Synced: {formatRelative(new Date(), LastSyncedDate)}
				</Text>
			) : (
				<Text style={styles.text}>Last Synced: Never</Text>
			)}
			{TotalItemCount ? (
				<Text style={styles.subsequentText}>
					Cached:{' '}
					<Text
						style={{
							color: APP_THEME.COLOR_SCHEME_D_EMPHASIS,
							fontFamily: 'Inter-Bold',
						}}
					>
						{TotalItemCount}
					</Text>
				</Text>
			) : (
				<View></View>
			)}
		</Fragment>
	);
}

const styles = {
	text: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		fontSize: 12,
		marginLeft: 4,
		marginTop: 4,
	},
	subsequentText: {
		color: APP_FONT.MONTSERRAT_HEADER,
		fontSize: 12,
		marginLeft: 4,
	},
};

export default LastSyncedStatus;
