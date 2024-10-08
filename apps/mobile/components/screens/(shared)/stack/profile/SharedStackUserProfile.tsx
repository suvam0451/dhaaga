import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import { useLocalSearchParams } from 'expo-router';
import {
	ActivitypubHelper,
	KNOWN_SOFTWARE,
} from '@dhaaga/shared-abstraction-activitypub';
import { useMemo } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import useScrollMoreOnPageEnd from '../../../../../states/useScrollMoreOnPageEnd';
import { Image } from 'expo-image';
import WithActivitypubUserContext, {
	useActivitypubUserContext,
} from '../../../../../states/useProfile';
import useMfm from '../../../../hooks/useMfm';
import ErrorGoBack from '../../../../error-screen/ErrorGoBack';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import useGetProfile from '../../../../../hooks/api/accounts/useGetProfile';
import styles from '../../../../common/user/utils/styles';
import { ProfileStatsInterface } from './fragments/ProfileStats';
import ProfileAvatar from '../../../../common/user/fragments/ProfileAvatar';
import Ionicons from '@expo/vector-icons/Ionicons';
import ProfileDesc from '../../../../common/user/fragments/ProfileDesc';
import ProfileButtonMessage from './fragments/ProfileButtonMessage';
import AntDesign from '@expo/vector-icons/AntDesign';
import RelationshipButtonCore from '../../../../common/relationship/RelationshipButtonCore';
import AppTopNavbar from '../../../../shared/topnavbar/AppTopNavbar';
import ProfileButtonPhonebook from './fragments/ProfileButtonPhonebook';
import ProfileModules from './modules/ProfileModules';

export function ProfileContextWrapped() {
	const { primaryAcct, domain } = useActivityPubRestClientContext();
	const subdomain = primaryAcct?.subdomain;
	const { user } = useActivitypubUserContext();

	const fields = user.getFields();
	const avatarUrl = user.getAvatarUrl();
	const bannerUrl = user.getBannerUrl();

	const { content: ParsedDisplayName } = useMfm({
		content: user?.getDisplayName(),
		remoteSubdomain: user?.getInstanceUrl(),
		emojiMap: user?.getEmojiMap(),
		deps: [user?.getDisplayName()],
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
	});
	const IS_LOCKED = user.getIsLockedProfile();

	const handle = useMemo(() => {
		return domain === KNOWN_SOFTWARE.BLUESKY
			? `@${user.getUsername()}`
			: ActivitypubHelper.getHandle(user?.getAccountUrl(subdomain), subdomain);
	}, [user?.getAccountUrl(subdomain)]);

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	return (
		<AppTopNavbar title={'Profile'} translateY={translateY}>
			<Animated.ScrollView
				onScroll={onScroll}
				contentContainerStyle={localStyles.rootScrollView}
			>
				{/*@ts-ignore-next-line*/}
				<Image
					source={{ uri: bannerUrl }}
					style={{ height: 128, width: Dimensions.get('window').width }}
				/>
				<View style={{ flexDirection: 'row' }}>
					<ProfileAvatar
						containerStyle={localStyles.avatarContainer}
						imageStyle={localStyles.avatarImageContainer}
						uri={avatarUrl}
					/>
					<View style={localStyles.buttonSection}>
						<ProfileButtonMessage handle={handle} />
						<View style={{ width: 8 }} />
						<ProfileButtonPhonebook />
					</View>
					<ProfileStatsInterface style={localStyles.statSectionContainer} />
				</View>
				<View style={localStyles.secondSectionContainer}>
					<View style={{ flexShrink: 1 }}>
						<Text
							style={{
								fontFamily: APP_FONTS.MONTSERRAT_900_BLACK,
								color: APP_FONT.MONTSERRAT_HEADER,
							}}
							numberOfLines={1}
						>
							{ParsedDisplayName}
						</Text>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.secondaryText} numberOfLines={1}>
								{handle}
							</Text>
							{IS_LOCKED && (
								<View style={{ marginLeft: 4 }}>
									<AntDesign
										name="lock1"
										size={14}
										color={APP_FONT.MONTSERRAT_BODY}
									/>
								</View>
							)}
						</View>
					</View>
					<View style={localStyles.relationManagerSection}>
						<View style={{ marginRight: 8 }}>
							<Ionicons
								name="notifications"
								size={22}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						</View>
						<RelationshipButtonCore userId={user?.getId()} />
					</View>
				</View>

				<ProfileDesc
					style={localStyles.parsedDescriptionContainer}
					rawContext={user?.getDescription()}
					remoteSubdomain={user?.getInstanceUrl()}
					emojiMap={user?.getEmojiMap()}
				/>

				{/*Separator*/}
				<View style={{ flexGrow: 1 }} />

				{/* Collapsible Sections */}
				<ProfileModules
					fields={fields}
					profileId={user.getId()}
					style={{ paddingBottom: 16 }}
				/>
			</Animated.ScrollView>
		</AppTopNavbar>
	);
}

function SharedStackUserProfile() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { Data, Error } = useGetProfile({ userId: id, requestId: 'N/A' });

	if (Error !== null) {
		return <ErrorGoBack msg={Error} />;
	}

	return (
		<WithActivitypubUserContext userI={Data}>
			<ProfileContextWrapped />
		</WithActivitypubUserContext>
	);
}

const localStyles = StyleSheet.create({
	rootScrollView: {
		paddingTop: 50,
		backgroundColor: '#121212',
		minHeight: '100%',
	},
	parsedDescriptionContainer: {
		marginTop: 12,
		padding: 8,
	},
	buttonSection: {
		alignItems: 'center',
		justifyContent: 'space-evenly',
		flexDirection: 'row',
		marginHorizontal: 8,
	},
	avatarImageContainer: {
		flex: 1,
		width: '100%',
		backgroundColor: '#0553',
		padding: 2,
		borderRadius: 72 / 2,
	},
	avatarContainer: {
		width: 72,
		height: 72,
		borderColor: 'rgba(200, 200, 200, 0.2)',
		borderWidth: 1,
		borderRadius: 72 / 2,
		marginTop: -24,
		marginLeft: 6,
	},
	relationManagerSection: {
		flexDirection: 'row',
		flexGrow: 1,
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingHorizontal: 8,
		marginLeft: 4,
		marginRight: 8,
	},
	statSectionContainer: {
		backgroundColor: '#242424',
		marginRight: 4,
		borderRadius: 8,
		marginTop: 4,
		padding: 4,
	},
	secondSectionContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 8,
		marginLeft: 8,
		width: '100%',
	},
});

export default SharedStackUserProfile;
