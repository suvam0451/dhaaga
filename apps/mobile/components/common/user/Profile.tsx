import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ActivityPubAccount } from '@dhaaga/shared-abstraction-activitypub';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from '../../containers/WithAutoHideTopNavBar';
import { Image } from 'expo-image';
import {
	AvatarContainerWithInset,
	AvatarExpoImage,
	ParsedDescriptionContainer,
} from '../../../styles/Containers';
import AppButtonFollowIndicator from '../../lib/Buttons';
import { PrimaryText, SecondaryText } from '../../../styles/Typography';
import UserProfileExtraInformation from '../../../screens/shared/profile/ExtraInformation';
import UserPostsProvider from '../../../contexts/UserPosts';
import ConfirmRelationshipChangeDialog from '../../screens/shared/fragments/ConfirmRelationshipChange';
import WithActivitypubUserContext, {
	useActivitypubUserContext,
} from '../../../states/useProfile';
import useMfm from '../../hooks/useMfm';
import useRelationshipWith from '../../../states/useRelationshipWith';
import { UserProfileBrowsePosts } from '../../../screens/shared/profile/UserProfile';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../styles/AppTheme';
import { router } from 'expo-router';
import ErrorGoBack from '../../error-screen/ErrorGoBack';

function ProfileContextWrapped() {
	const { user: userParam } = useLocalSearchParams<{ user: string }>();

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

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	const [
		IsUnfollowConfirmationDialogVisible,
		setIsUnfollowConfirmationDialogVisible,
	] = useState(false);
	const ScrollRef = useRef(null);

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
		<WithAutoHideTopNavBar title={'Profile'} translateY={translateY}>
			<View
				style={{
					backgroundColor: '#121212',
					minHeight: '100%',
				}}
			>
				<Animated.ScrollView
					ref={ScrollRef}
					onScroll={onScroll}
					contentContainerStyle={{
						paddingTop: 54,
						backgroundColor: '#121212',
						minHeight: '100%',
					}}
				>
					{/*@ts-ignore-next-line*/}
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
				</Animated.ScrollView>
				<ConfirmRelationshipChangeDialog
					visible={IsUnfollowConfirmationDialogVisible}
					setVisible={setIsUnfollowConfirmationDialogVisible}
				/>
			</View>
		</WithAutoHideTopNavBar>
	);
}

function Profile() {
	const { client } = useActivityPubRestClientContext();
	const { user } = useLocalSearchParams<{ user: string }>();
	const [Data, setData] = useState(null);

	const [FetchError, setFetchError] = useState(null);

	useEffect(() => {
		setFetchError(null);
	}, [user]);

	async function api() {
		if (!client) return null;
		const { data, error } = await client.accounts.get(user);
		if (error) setFetchError({ message: error.code });
		return data;
	}

	// Queries
	const { status, data } = useQuery<ActivityPubAccount>({
		queryKey: [user],
		queryFn: api,
		enabled: client !== undefined && client !== null,
	});

	useEffect(() => {
		if (status !== 'success' || !data) return;
		setData(data);
	}, [status]);

	if (FetchError !== null) {
		return <ErrorGoBack msg={FetchError?.message} />;
	}

	return (
		<WithActivitypubUserContext user={Data}>
			<ProfileContextWrapped />
		</WithActivitypubUserContext>
	);
}

export default Profile;
