import { APP_FONT, APP_THEME } from '../../styles/AppTheme';
import { formatRelative } from 'date-fns';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import { Fragment, memo, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { APP_FONTS } from '../../styles/AppFonts';
// import { useObject } from '@realm/react';
import { Account } from '../../entities/account.entity';

export enum LAST_SYNCED_STATUS_KEY {
	BOOKMARK_SYNC = 'BOOKMARK_SYNC',
	FAVOURITE_SYNC = 'FAVOURITE_SYNC',
	HASHTAG_SYNC = 'HASHTAG_SYNC',
}

type Props = {
	id: LAST_SYNCED_STATUS_KEY;
};

const LastSyncedStatus = memo(({ id }: Props) => {
	const { PrimaryAcctPtr } = useActivityPubRestClientContext();
	const [LastSyncedDate, setLastSyncedDate] = useState(null);
	const [TotalItemCount, setTotalItemCount] = useState(null);

	// const acct = useObject(Account, PrimaryAcctPtr.current);

	useEffect(() => {
		switch (id) {
			case LAST_SYNCED_STATUS_KEY.BOOKMARK_SYNC: {
				// setLastSyncedDate(acct?.bookmarksLastSyncedAt);
				// setTotalItemCount(acct.bookmarks.length);
				break;
			}
			case LAST_SYNCED_STATUS_KEY.FAVOURITE_SYNC: {
				// setLastSyncedDate(acct?.favouritesLastSyncedAt);
				break;
			}
			case LAST_SYNCED_STATUS_KEY.HASHTAG_SYNC: {
				// setLastSyncedDate(acct.hashtagsLastSyncedAt);
				break;
			}
			default: {
				setLastSyncedDate(null);
			}
		}
	}, [id]);

	if (LastSyncedDate) {
		return (
			<Fragment>
				<Text style={styles.text}>
					Last Synced: {formatRelative(new Date(), LastSyncedDate)}
				</Text>
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
			</Fragment>
		);
	}
	return <Text style={styles.text}>Last Synced: Never</Text>;
});

const styles = {
	text: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		fontSize: 12,
		marginLeft: 4,
		marginTop: 4,
	},
	subsequentText: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		fontSize: 12,
		marginLeft: 4,
	},
};

export default LastSyncedStatus;
