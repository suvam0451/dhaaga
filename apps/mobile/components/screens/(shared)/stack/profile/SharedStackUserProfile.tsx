import { useLocalSearchParams } from 'expo-router';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import useScrollMoreOnPageEnd from '../../../../../states/useScrollMoreOnPageEnd';
import { Image } from 'expo-image';
import useMfm from '../../../../hooks/useMfm';
import ErrorGoBack from '../../../../error-screen/ErrorGoBack';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import useGetProfile from '../../../../../hooks/api/accounts/useGetProfile';
import styles from '../../../../common/user/utils/styles';
import ProfileStats from './fragments/ProfileStats';
import ProfileAvatar from '../../../../common/user/fragments/ProfileAvatar';
import ProfileDesc from '../../../../common/user/fragments/ProfileDesc';
import ProfileButtonMessage from './fragments/ProfileButtonMessage';
import AntDesign from '@expo/vector-icons/AntDesign';
import RelationshipButtonCore from '../../../../common/relationship/RelationshipButtonCore';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../shared/topnavbar/AppTopNavbar';
import ProfileButtonPhonebook from './fragments/ProfileButtonPhonebook';
import ProfileModules from './modules/ProfileModules';
import { useAppTheme } from '../../../../../hooks/app/useAppThemePack';
import { AppIcon } from '../../../../lib/Icon';

export function ProfileContextWrapped() {
	const { colorScheme } = useAppTheme();
	const { id } = useLocalSearchParams<{ id: string }>();
	const { Data: acct, Error } = useGetProfile({ userId: id, requestId: 'N/A' });

	const fields = acct?.meta?.fields;
	const avatarUrl = acct?.avatarUrl;
	const bannerUrl = acct?.banner;

	const { content: ParsedDisplayName } = useMfm({
		content: acct?.displayName,
		remoteSubdomain: acct?.instance,
		emojiMap: acct?.calculated?.emojis,
		deps: [acct?.displayName],
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		emphasis: 'high',
	});
	const IS_LOCKED = acct?.meta?.isProfileLocked;

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	if (Error !== null) {
		return <ErrorGoBack msg={Error} />;
	}

	return (
		<AppTopNavbar
			title={'Profile'}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.PROFILE}
		>
			<Animated.ScrollView
				onScroll={onScroll}
				contentContainerStyle={[
					localStyles.rootScrollView,
					{ backgroundColor: colorScheme.palette.bg },
				]}
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
						<ProfileButtonMessage handle={acct?.handle} />
						<View style={{ width: 8 }} />
						<ProfileButtonPhonebook />
					</View>
					<ProfileStats
						userId={acct?.id}
						postCount={acct?.stats?.posts}
						followingCount={acct?.stats?.following}
						followerCount={acct?.stats?.followers}
						style={localStyles.statSectionContainer}
					/>
				</View>
				<View style={localStyles.secondSectionContainer}>
					<View style={{ flexShrink: 1 }}>
						<Text
							style={{
								fontFamily: APP_FONTS.MONTSERRAT_900_BLACK,
								color: APP_FONT.HIGH_EMPHASIS,
							}}
							numberOfLines={1}
						>
							{ParsedDisplayName}
						</Text>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text
								style={[
									styles.secondaryText,
									{ color: colorScheme.textColor.medium },
								]}
								numberOfLines={1}
							>
								{acct?.handle}
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
						<AppIcon
							id={'bell'}
							size={22}
							containerStyle={{ marginRight: 8 }}
						/>
						<RelationshipButtonCore userId={acct?.id} />
					</View>
				</View>

				<ProfileDesc
					style={localStyles.parsedDescriptionContainer}
					rawContext={acct?.description}
					remoteSubdomain={acct?.instance}
					emojiMap={acct?.calculated?.emojis}
				/>

				{/*Separator*/}
				<View style={{ flexGrow: 1 }} />

				{/* Collapsible Sections */}
				<ProfileModules
					acct={acct}
					fields={fields}
					profileId={acct?.id}
					style={{ paddingBottom: 16 }}
				/>
			</Animated.ScrollView>
		</AppTopNavbar>
	);
}

export default ProfileContextWrapped;

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
		padding: 2,
		borderRadius: 72 / 2,
	},
	avatarContainer: {
		width: 72,
		height: 72,
		borderColor: 'rgba(200, 200, 200, 0.12)',
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
