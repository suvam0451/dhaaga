import { Fragment, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, ListItem, Skeleton } from '@rneui/themed';
import {
	ScrollView,
	TouchableOpacity,
	View,
	Text,
	StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WithActivitypubTagContext, {
	useActivitypubTagContext,
} from '../../states/useTag';
import { TagType } from '@dhaaga/shared-abstraction-activitypub';
import InstanceService from '../../services/instance.service';
import useSkeletonSmoothTransition from '../../states/useSkeletonTransition';
import { APP_FONT } from '../../styles/AppTheme';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { APP_FONTS } from '../../styles/AppFonts';
import MisskeyTag from '@dhaaga/shared-abstraction-activitypub/dist/adapters/tag/misskey';
import useAppNavigator from '../../states/useAppNavigator';
import TagButtonFollow from './hashtag/fragments/TagButtonFollow';
import TagButtonBrowseLocal from './hashtag/fragments/TagButtonBrowseLocal';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type HashtagActionsProps = {
	visible: boolean;
	id: string;
};

type HashtagBottomSheetContentProps = {
	parentApiPending: boolean;
};

export function HashtagBottomSheetContent({
	parentApiPending,
}: HashtagBottomSheetContentProps) {
	const { hide } = useGlobalState(
		useShallow((o) => ({
			hide: o.bottomSheet.hide,
		})),
	);
	const { driver, acct } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
			acct: o.acct,
		})),
	);
	const { tag } = useActivitypubTagContext();
	const [IsLoading, setIsLoading] = useState(false);

	const [AggregatedData, setAggregatedData] = useState({
		posts: 0,
		users: 0,
	});
	useEffect(() => {
		if (!tag) return;
		setIsLoading(true);
		InstanceService.getTagInfoCrossDomain(tag, acct?.server)
			.then((res) => {
				setAggregatedData({
					users: res.common.users,
					posts: res.common.posts,
				});
			})
			.catch((e) => {
				console.log('[ERROR]:', e);
			})
			.finally(() => {
				setTimeout(() => {
					setIsLoading(false);
				}, 150);
			});
	}, [tag]);

	const loaded = useSkeletonSmoothTransition(
		!tag || tag.getName() === '' || IsLoading || parentApiPending,
		{
			condition: !parentApiPending,
			preventLoadingForCondition: true,
		},
	);
	if (!loaded) return <HashtagSkeleton />;

	const summaryText = useMemo(() => {
		if (driver === KNOWN_SOFTWARE.MASTODON) {
			return `${AggregatedData.posts} posts , ${AggregatedData.users} users`;
		} else {
			return `${(tag as MisskeyTag).getMentionedUsersCount()} users`;
		}
	}, [AggregatedData, driver]);

	const TAG_SUBSCRIBE_POSSIBLE = useMemo(() => {
		return driver === KNOWN_SOFTWARE.MASTODON;
	}, [driver]);

	const { toTag } = useAppNavigator();

	function onNavigate() {
		hide();
		toTag(tag.getName());
	}

	return (
		<Fragment>
			<ListItem
				containerStyle={{
					backgroundColor: '#2C2C2C',
				}}
			>
				<ListItem.Content style={{ width: '100%' }}>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<View style={{ flex: 1, flexGrow: 1 }}>
							<ScrollView
								horizontal={true}
								scrollEnabled={true}
								showsHorizontalScrollIndicator={false}
							>
								<ListItem.Title
									style={{
										color: '#fff',
										fontSize: 18,
										fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
										opacity: 0.6,
									}}
								>
									#{tag.getName()}
								</ListItem.Title>
							</ScrollView>
							<Text
								style={{
									color: APP_FONT.MONTSERRAT_BODY,
									fontFamily: APP_FONTS.INTER_400_REGULAR,
								}}
							>
								{summaryText}
							</Text>
						</View>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								marginLeft: 8,
							}}
						>
							<TagButtonFollow />
							<TagButtonBrowseLocal name={tag?.getName()} />
						</View>
					</View>
				</ListItem.Content>
			</ListItem>
			<ListItem
				containerStyle={{
					backgroundColor: '#2C2C2C',
				}}
			>
				<ListItem.Content>
					<View
						style={{
							backgroundColor: '#2C2C2C',
							display: 'flex',
							flexDirection: 'row',
						}}
					>
						<View style={{ flex: 1 }}>
							<TouchableOpacity onPress={onNavigate}>
								<Button
									type={'clear'}
									style={{ opacity: 0.6, marginRight: 2 }}
									buttonStyle={{
										backgroundColor: '#333333',
										borderRadius: 8,
									}}
									containerStyle={{
										marginRight: 2,
									}}
								>
									<View>
										<View
											style={{
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<View>
												<Text style={styles.instanceTargetDesc}>
													Your Instance
												</Text>
												<Text style={styles.instanceTarget} numberOfLines={1}>
													{acct?.server}
												</Text>
												<Text style={styles.instanceMetrics}>
													{AggregatedData.posts} posts by {AggregatedData.users}{' '}
													users
												</Text>
											</View>
										</View>
									</View>
								</Button>
							</TouchableOpacity>
						</View>
						<View style={{ flex: 1, paddingLeft: 6 }}>
							<Button
								type={'clear'}
								style={{ opacity: 0.6 }}
								buttonStyle={{ backgroundColor: '#333333', borderRadius: 8 }}
							>
								<View>
									<View
										style={{
											display: 'flex',
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<View>
											<Text style={styles.instanceTargetDesc}>
												Their Instance
											</Text>
											<Text style={styles.instanceTarget}>misskey.io</Text>
											<Text style={styles.instanceMetrics}>
												{AggregatedData.posts} posts by {AggregatedData.users}{' '}
												users
											</Text>
										</View>
									</View>
								</View>
							</Button>
						</View>
					</View>
				</ListItem.Content>
			</ListItem>
			<ListItem
				containerStyle={{
					backgroundColor: '#2C2C2C',
					justifyContent: 'space-between',
					flexDirection: 'row',
				}}
			>
				<View style={{ flex: 1 }}>
					<Button
						type={'outline'}
						buttonStyle={{
							backgroundColor: '#232323',
							borderColor: '#ffffff30',
						}}
						containerStyle={{ borderColor: 'purple' }}
						style={{ opacity: 0.6 }}
					>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Text
								style={{
									fontSize: 16,
									fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
									color: APP_FONT.MONTSERRAT_BODY,
								}}
							>
								Follow (Private)
							</Text>
						</View>
					</Button>
				</View>
				<View style={{ flex: 1 }}>
					<Button type={'clear'} style={{ opacity: 0.6 }}>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<View style={{ marginRight: 4 }}>
								<Ionicons name={'eye-off-outline'} color={'red'} size={24} />
							</View>
							<Text style={{ fontSize: 16, marginLeft: 4, color: 'red' }}>
								Hide Locally
							</Text>
						</View>
					</Button>
				</View>
			</ListItem>
		</Fragment>
	);
}

function HashtagSkeleton() {
	return (
		<View
			style={{
				width: '100%',
				paddingHorizontal: 16,
			}}
		>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					paddingTop: 16,
				}}
			>
				<View style={{ flexGrow: 1 }}>
					<Skeleton
						style={{ height: 56, borderRadius: 8 }}
						animation={'pulse'}
					/>
				</View>
				<View
					style={{
						marginLeft: 32,
						height: 56,
						width: 128,
					}}
				>
					<Skeleton
						style={{ height: 56, width: 128, borderRadius: 8 }}
						animation={'pulse'}
					/>
				</View>
			</View>
			<View style={{ marginBottom: 32 }}>
				<Skeleton
					style={{
						marginTop: 32,
						height: 72,
						borderRadius: 8,
					}}
					animation={'pulse'}
				/>
			</View>
			<View>
				<Skeleton
					style={{
						marginTop: 0,
						height: 64,
						borderRadius: 8,
					}}
					animation={'pulse'}
				/>
			</View>
		</View>
	);
}

function HashtagBottomSheet({ id }: HashtagActionsProps) {
	const [Data, setData] = useState(null);
	const { router } = useGlobalState(
		useShallow((o) => ({
			router: o.router,
		})),
	);

	async function api() {
		if (!router) return null;
		const { data, error } = await router.tags.get(id);
		if (error) {
			console.log(error);
			return null;
		}
		return data;
	}

	// Queries
	const { status, data } = useQuery<TagType | null>({
		queryKey: ['tag', id],
		queryFn: api,
		enabled: router !== null && id !== null,
	});

	useEffect(() => {
		if (status !== 'success' || !data) return;
		setData(data);
	}, [data, status]);

	return (
		<WithActivitypubTagContext tag={Data}>
			<HashtagBottomSheetContent
				parentApiPending={status !== 'success' || !data}
			/>
		</WithActivitypubTagContext>
	);
}

const styles = StyleSheet.create({
	instanceTargetDesc: {
		fontSize: 16,
		marginRight: 4,
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		color: 'orange',
		opacity: 0.6,
	},
	instanceTarget: {
		fontSize: 12,
		opacity: 0.6,
		color: 'orange',
		fontFamily: APP_FONTS.INTER_700_BOLD,
	},
	instanceMetrics: {
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 12,
	},
});
export default HashtagBottomSheet;
