import React, { useEffect, useState } from 'react';
import {
	Dimensions,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import {
	ActivityPubAccount,
	ActivityPubStatuses,
} from '@dhaaga/shared-abstraction-activitypub/src';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import {
	AvatarContainerWithInset,
	AvatarExpoImage,
	ParsedDescriptionContainer,
} from '../../../styles/Containers';
import { PrimaryText, SecondaryText } from '../../../styles/Typography';
import { Text } from '@rneui/themed';
import StatusItem from '../../../components/common/status/StatusItem';
import UserPostsProvider, { UserPostsHook } from '../../../contexts/UserPosts';
import Ionicons from '@expo/vector-icons/Ionicons';
import UserProfileExtraInformation from './ExtraInformation';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import WithActivitypubStatusContext from '../../../states/useStatus';
import { Skeleton } from '@rneui/themed';
import WithActivitypubUserContext, {
	useActivitypubUserContext,
} from '../../../states/useProfile';
import useMfm from '../../../components/hooks/useMfm';
import { APP_FONT } from '../../../styles/AppTheme';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from '../../../components/containers/WithAutoHideTopNavBar';
import AppButtonFollowIndicator from '../../../components/lib/Buttons';
import useRelationshipWith from '../../../states/useRelationshipWith';
import ConfirmRelationshipChangeDialog from '../../../components/screens/shared/fragments/ConfirmRelationshipChange';

type UserProfileBrowsePostsProps = {
	userId: string;
};

/**
 * Component to allow users to view images and posts of a user
 * @param param0
 * @returns
 */
function UserProfileBrowsePosts({ userId }: UserProfileBrowsePostsProps) {
	const { store, dispatch } = UserPostsHook();
	const [RecentPostsCollapsed, setRecentPostsCollapsed] = useState(true);
	const { client } = useActivityPubRestClientContext();

	async function queryFnPosts() {
		return await client.getUserPosts(userId, {
			excludeReplies: true,
			limit: 5,
		});
	}

	// Post Queries
	const { status, data, error, fetchStatus, refetch } =
		useQuery<ActivityPubStatuses>({
			queryKey: ['profile/posts', client, userId],
			queryFn: queryFnPosts,
			enabled: userId !== undefined,
		});

	useEffect(() => {
		if (status === 'success') {
			dispatch.setPosts(data);
		}
	}, [status, data]);

	return (
		<View style={{ paddingHorizontal: 8 }}>
			<View style={styles.expandableSectionMarkerContainer}>
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_HEADER,
						flexGrow: 1,
					}}
				>
					Images
				</Text>
				<Ionicons
					name="chevron-forward"
					size={24}
					color={APP_FONT.MONTSERRAT_BODY}
				/>
			</View>
			<TouchableOpacity
				onPress={() => {
					setRecentPostsCollapsed(!RecentPostsCollapsed);
				}}
			>
				<View style={styles.expandableSectionMarkerContainer}>
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_HEADER,
							flexGrow: 1,
						}}
					>
						Pinned Posts
					</Text>
					<Ionicons
						name={RecentPostsCollapsed ? 'chevron-forward' : 'chevron-down'}
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				</View>
			</TouchableOpacity>
			<View style={{ display: RecentPostsCollapsed ? 'none' : 'flex' }}>
				{store.posts &&
					store.posts.map((o, i) => (
						<WithActivitypubStatusContext status={o} key={i}>
							<StatusItem />
						</WithActivitypubStatusContext>
					))}
			</View>
		</View>
	);
}

function UserProfileContent() {
	const { primaryAcct, client } = useActivityPubRestClientContext();
	const subdomain = primaryAcct?.subdomain;
	const { user } = useActivitypubUserContext();

	const fields = user.getFields();
	const avatarUrl = user.getAvatarUrl();
	const bannerUrl = user.getBannerUrl();

	const { content: DescriptionContent } = useMfm({
		content: user?.getDescription(),
		remoteSubdomain: user?.getInstanceUrl(),
		emojiMap: user?.getEmojiMap(),
		deps: [user?.getDescription()],
	});

	const { content: ParsedDisplayName } = useMfm({
		content: user?.getDisplayName(),
		remoteSubdomain: user?.getInstanceUrl(),
		emojiMap: user?.getEmojiMap(),
		deps: [user?.getDisplayName()],
	});

	const { relationship, setter, relationshipLoading } = useRelationshipWith(
		user?.getId(),
	);

	const [
		IsUnfollowConfirmationDialogVisible,
		setIsUnfollowConfirmationDialogVisible,
	] = useState(false);

	function onFollowButtonClick() {
		if (!relationship.following) {
			client
				.followUser(user?.getId(), {
					reblogs: true,
					notify: false,
				})
				.then((res) => {
					setter(res);
				})
				.catch((e) => {
					console.log('[ERROR]: following user', e);
				});
		} else {
			setIsUnfollowConfirmationDialogVisible(true);
			// client.unfollowUser(user?.getId()).then((res) => {
			// 	setter(res);
			// });
		}
	}

	return (
		<View
			style={{ backgroundColor: '#121212', minHeight: '100%', paddingTop: 54 }}
		>
			<ScrollView>
				<Image
					source={{ uri: bannerUrl }}
					style={{ height: 128, width: Dimensions.get('window').width }}
				/>
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<AvatarContainerWithInset>
						<AvatarExpoImage source={{ uri: avatarUrl }} />
					</AvatarContainerWithInset>
					<View
						style={{
							flexGrow: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<View style={{ paddingHorizontal: 12, width: '100%' }}>
							<AppButtonFollowIndicator
								size={'sm'}
								activeLabel={'Following'}
								passiveLabel={'Follow'}
								onClick={onFollowButtonClick}
								isCompleted={relationship.following}
								loading={relationshipLoading}
							/>
						</View>
					</View>
					<View style={{ display: 'flex', flexDirection: 'row' }}>
						<View
							style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}
						>
							<PrimaryText>{user.getPostCount()}</PrimaryText>
							<SecondaryText>Posts</SecondaryText>
						</View>
						<View
							style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}
						>
							<PrimaryText>{user.getFollowingCount()}</PrimaryText>
							<SecondaryText>Following</SecondaryText>
						</View>
						<View
							style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}
						>
							<PrimaryText>{user.getFollowersCount()}</PrimaryText>
							<SecondaryText>Followers</SecondaryText>
						</View>
					</View>
				</View>
				<View style={{ marginLeft: 8 }}>
					<PrimaryText>{ParsedDisplayName}</PrimaryText>
					<SecondaryText>
						{user.getAppDisplayAccountUrl(subdomain)}
					</SecondaryText>
				</View>
				<ParsedDescriptionContainer>
					{DescriptionContent}
				</ParsedDescriptionContainer>

				{/*Separator*/}
				<View style={{ flexGrow: 1 }} />

				<UserProfileExtraInformation fields={fields} />
				<View style={{ paddingBottom: 16 }}>
					<UserPostsProvider>
						<UserProfileBrowsePosts userId={user.getId()} />
					</UserPostsProvider>
				</View>
			</ScrollView>
			<ConfirmRelationshipChangeDialog
				visible={IsUnfollowConfirmationDialogVisible}
				setVisible={setIsUnfollowConfirmationDialogVisible}
			/>
		</View>
	);
}

function UserProfile({ route, navigation }) {
	const { client } = useActivityPubRestClientContext();
	const q = route?.params?.id;
	const [Data, setData] = useState(null);

	function api() {
		if (!client) return null;
		const username = route?.params?.id;
		return client.getUserProfile(username);
	}

	// Queries
	const { status, data, fetchStatus } = useQuery<ActivityPubAccount>({
		queryKey: ['profile', q],
		queryFn: api,
		enabled: client && q !== undefined,
	});

	useEffect(() => {
		if (status !== 'success' || !data) return;
		setData(data);
	}, [status]);

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	if (fetchStatus === 'fetching' || !Data)
		return (
			<View
				style={{
					backgroundColor: '#1e1e1e',
					height: '100%',
				}}
			>
				<Skeleton height={128} width={Dimensions.get('window').width} />
			</View>
		);

	return (
		<WithAutoHideTopNavBar title={'Profile'} translateY={translateY}>
			<WithActivitypubUserContext user={Data}>
				<UserProfileContent />
			</WithActivitypubUserContext>
		</WithAutoHideTopNavBar>
	);
}

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		backgroundColor: '#1c1c1c',
		left: 0,
		right: 0,
		width: '100%',
		zIndex: 1,
	},
	expandableSectionMarkerContainer: {
		marginVertical: 6,
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 16,
		paddingRight: 16,
		backgroundColor: '#272727',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 8,
	},
});
export default UserProfile;
