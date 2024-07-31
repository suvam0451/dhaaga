import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { useLocalSearchParams } from 'expo-router';
import { ActivitypubHelper } from '@dhaaga/shared-abstraction-activitypub';
import { useMemo, useRef } from 'react';
import { Animated, Dimensions, View, StyleSheet, Text } from 'react-native';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from '../../containers/WithAutoHideTopNavBar';
import { Image } from 'expo-image';
import { AvatarContainerWithInset } from '../../../styles/Containers';
import UserProfileExtraInformation from './fragments/ExtraInformation';
import WithActivitypubUserContext, {
	useActivitypubUserContext,
} from '../../../states/useProfile';
import useMfm from '../../hooks/useMfm';
import ErrorGoBack from '../../error-screen/ErrorGoBack';
import PinnedPosts from './fragments/PinnedPosts';
import ProfileImageGallery from './fragments/ProfileImageGallery';
import { APP_FONT } from '../../../styles/AppTheme';
import { APP_FONTS } from '../../../styles/AppFonts';
import useProfile from './api/useProfile';
import FollowIndicator from './fragments/FollowIndicator';

function ProfileContextWrapped() {
	const { primaryAcct } = useActivityPubRestClientContext();
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
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	});

	const { content: ParsedDisplayName } = useMfm({
		content: user?.getDisplayName(),
		remoteSubdomain: user?.getInstanceUrl(),
		emojiMap: user?.getEmojiMap(),
		deps: [user?.getDisplayName()],
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
	});

	const handle = useMemo(() => {
		return ActivitypubHelper.getHandle(user?.getAccountUrl(), subdomain);
	}, [user?.getAccountUrl()]);

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	const ScrollRef = useRef(null);

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
							{/*@ts-ignore-next-line*/}
							<Image
								source={{ uri: avatarUrl }}
								style={styles.avatarContainer}
							/>
						</AvatarContainerWithInset>
						<View
							style={{
								flexGrow: 1,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<View
								style={{
									paddingHorizontal: 8,
									marginLeft: 8,
									width: '100%',
								}}
							>
								<FollowIndicator userId={user?.getId()} />
							</View>
						</View>
						<View style={{ display: 'flex', flexDirection: 'row' }}>
							<View
								style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}
							>
								<Text style={styles.primaryText}>{user.getPostCount()}</Text>
								<Text style={styles.secondaryText}>Posts</Text>
							</View>
							<View
								style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}
							>
								<Text style={styles.primaryText}>
									{user.getFollowingCount()}
								</Text>
								<Text style={styles.secondaryText}>Following</Text>
							</View>
							<View
								style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}
							>
								<Text style={styles.primaryText}>
									{user.getFollowersCount()}
								</Text>
								<Text style={styles.secondaryText}>Followers</Text>
							</View>
						</View>
					</View>
					<View style={{ marginLeft: 8 }}>
						<Text
							style={{
								fontFamily: APP_FONTS.MONTSERRAT_900_BLACK,
								color: APP_FONT.MONTSERRAT_HEADER,
							}}
						>
							{ParsedDisplayName}
						</Text>
						<Text style={styles.secondaryText}>{handle}</Text>
					</View>
					<View style={styles.parsedDescriptionContainer}>
						{DescriptionContent}
					</View>

					{/*Separator*/}
					<View style={{ flexGrow: 1 }} />

					{/* Collapsible Sections */}
					<View style={{ paddingBottom: 16 }}>
						<UserProfileExtraInformation fields={fields} />
						<ProfileImageGallery userId={user.getId()} />
						<PinnedPosts userId={user.getId()} />
					</View>
				</Animated.ScrollView>
			</View>
		</WithAutoHideTopNavBar>
	);
}

function Profile() {
	const { user } = useLocalSearchParams<{ user: string }>();
	const { Data, Error } = useProfile(user);

	if (Error !== null) {
		return <ErrorGoBack msg={Error} />;
	}

	return (
		<WithActivitypubUserContext user={Data}>
			<ProfileContextWrapped />
		</WithActivitypubUserContext>
	);
}

const styles = StyleSheet.create({
	primaryText: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
	},
	secondaryText: {
		color: '#888',
		fontSize: 12,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
	parsedDescriptionContainer: {
		marginTop: 12,
		padding: 8,
	},
	avatarContainer: {
		flex: 1,
		width: '100%',
		backgroundColor: '#0553',
		padding: 2,
	},
});

export default Profile;
