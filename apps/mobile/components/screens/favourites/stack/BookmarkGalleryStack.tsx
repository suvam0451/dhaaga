import { ScrollView, View } from 'react-native';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import { useQuery } from '@realm/react';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { Account } from '../../../../entities/account.entity';
import { useMemo, useState } from 'react';
import { ActivityPubStatus } from '../../../../entities/activitypub-status.entity';
import { ActivityPubUser } from '../../../../entities/activitypub-user.entity';
import { Image } from 'expo-image';
import { Text } from '@rneui/themed';
import RealmStatus from '../../../common/status/RealmStatus';
import { FontAwesome } from '@expo/vector-icons';
import { APP_FONT } from '../../../../styles/AppTheme';

const USER_SELECTION_BUBBLE_SIZE = 54;

function BookmarkGalleryStack() {
	const { primaryAcct } = useActivityPubRestClientContext();
	const [Offset, setOffset] = useState(0);
	const [Limit, setLimit] = useState(20);

	const acct: Account = useQuery(Account).find(
		(o) => o._id.toString() === primaryAcct._id.toString(),
	);

	const retval = useMemo(() => {
		let start = performance.now();
		const acctLookup = new Map<string, ActivityPubUser>();
		const acctBookmarks = new Map<string, ActivityPubStatus[]>();
		for (const acctBookmark of acct.bookmarks) {
			const k = acctBookmark.postedBy.userId;
			if (!acctLookup.has(k)) {
				acctLookup.set(k, acctBookmark.postedBy);
				acctBookmarks.set(k, [acctBookmark]);
			} else {
				acctBookmarks.get(k).push(acctBookmark);
			}
		}

		const accounts: {
			user: ActivityPubUser;
			posts: ActivityPubStatus[];
			count: number;
		}[] = [];

		// @ts-ignore
		for (let [k, v] of acctLookup.entries()) {
			const _u = acctLookup.get(k);
			const _posts = acctBookmarks.get(k);
			accounts.push({
				user: _u,
				posts: _posts,
				count: _posts.length,
			});
		}
		const sorted = accounts.sort((a, b) => b.count - a.count);
		let end = performance.now();
		console.log('[INFO]: bookmarks loaded from do in', end - start, 'ms');
		return sorted;
	}, [acct]);

	const postsToShow = useMemo(() => {
		return acct.bookmarks.slice(Offset, Offset + Limit);
	}, [retval, Offset]);

	return (
		<WithAutoHideTopNavBar title={'Bookmark Gallery'}>
			<View style={{ height: '100%', display: 'flex', paddingBottom: 54 }}>
				<ScrollView style={{ flexGrow: 1 }}>
					{postsToShow.map((o, i) => (
						<View key={i}>
							<RealmStatus _id={o._id} />
						</View>
					))}
				</ScrollView>

				<View
					style={{
						paddingBottom: 16,
						backgroundColor: '#363636',
						marginBottom: 16,
						marginHorizontal: 8,
						paddingHorizontal: 8,
						borderRadius: 8,
						display: 'flex',
					}}
				>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							width: '100%',
							marginVertical: 16,
						}}
					>
						<View style={{ flexGrow: 1 }}>
							<Text>
								{acct.bookmarks.length} Posts from {retval.length} users.
							</Text>
						</View>
						<View style={{ display: 'flex', flexDirection: 'row' }}>
							<View style={{ marginRight: 16 }}>
								<FontAwesome
									name="search"
									size={24}
									color={APP_FONT.MONTSERRAT_BODY}
								/>
							</View>

							<View style={{ marginRight: 8 }}>
								<FontAwesome
									name="chevron-down"
									size={24}
									color={APP_FONT.MONTSERRAT_BODY}
								/>
							</View>
						</View>
					</View>

					<ScrollView horizontal>
						{retval.map((o, i) => (
							<View key={i}>
								<View
									style={{
										height: USER_SELECTION_BUBBLE_SIZE,
										width: USER_SELECTION_BUBBLE_SIZE,
										// borderRadius: 16,
										marginRight: 8,
										position: 'relative',
										borderColor: 'gray',
										borderWidth: 2,
										borderRadius: 6,
									}}
								>
									<Image
										source={o.user.avatarUrl}
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
											// top: '100%',
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
														{o.count}
													</Text>
												</View>
											</View>
										</View>
									</View>
								</View>
							</View>
						))}
					</ScrollView>
				</View>
			</View>
		</WithAutoHideTopNavBar>
	);
}

export default BookmarkGalleryStack;
