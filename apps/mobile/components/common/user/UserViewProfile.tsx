import { useLocalSearchParams } from 'expo-router';
import {
	Animated,
	Dimensions,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { Image } from 'expo-image';
import useMfm from '../../hooks/useMfm';
import { APP_FONTS } from '../../../styles/AppFonts';
import useGetProfile from '../../../hooks/api/accounts/useGetProfile';
import styles from './utils/styles';
import UserViewProfileStats from './fragments/UserViewProfileStats';
import ProfileAvatar from './fragments/ProfileAvatar';
import ProfileDesc from './fragments/ProfileDesc';
import RelationshipButtonCore from '../relationship/RelationshipButtonCore';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../shared/topnavbar/AppTopNavbar';
import ProfileModules from '../../screens/(shared)/stack/profile/modules/ProfileModules';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { AppIcon } from '../../lib/Icon';
import { appDimensions } from '../../../styles/dimensions';
import {
	useAppBottomSheet_Improved,
	useAppManager,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { APP_BOTTOM_SHEET_ENUM } from '../../dhaaga-bottom-sheet/Core';

export function ProfileContextWrapped() {
	const { theme } = useAppTheme();
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data: acct, error } = useGetProfile({ userId: id });

	const fields = acct?.meta?.fields;
	const avatarUrl = acct?.avatarUrl;
	const bannerUrl = acct?.banner;

	const { content: ParsedDisplayName } = useMfm({
		content: acct?.displayName,
		remoteSubdomain: acct?.instance,
		emojiMap: acct?.calculated?.emojis,
		deps: [acct?.displayName],
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
		emphasis: APP_COLOR_PALETTE_EMPHASIS.A10,
	});
	const IS_LOCKED = acct?.meta?.isProfileLocked;

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	const { show } = useAppBottomSheet_Improved();
	const { appManager } = useAppManager();
	function onMoreOptionsPressed() {
		if (!acct) return;
		appManager.storage.setUserId(acct.id);
		appManager.storage.setUserObject(acct);
		show(APP_BOTTOM_SHEET_ENUM.MORE_USER_ACTIONS, true);
	}

	if (error || !acct) return <View />;

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
					{ backgroundColor: theme.palette.bg },
				]}
			>
				{bannerUrl ? (
					// @ts-ignore-next-line
					<Image
						source={{ uri: bannerUrl }}
						style={{ height: 128, width: Dimensions.get('window').width }}
					/>
				) : (
					<View style={{ height: 48, width: '100%' }} />
				)}
				<View style={{ flexDirection: 'row', width: '100%' }}>
					<ProfileAvatar
						containerStyle={[localStyles.avatarContainer]}
						imageStyle={localStyles.avatarImageContainer}
						uri={avatarUrl}
					/>
					<UserViewProfileStats
						userId={acct?.id}
						postCount={acct?.stats?.posts}
						followingCount={acct?.stats?.following}
						followerCount={acct?.stats?.followers}
					/>
				</View>
				<View
					style={{
						flexDirection: 'row',
						flex: 1,
						flexGrow: 1,
						marginLeft: 8,
						marginTop: 6,
					}}
				>
					<View>
						{ParsedDisplayName}
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text
								style={[styles.secondaryText, { color: theme.secondary.a30 }]}
								numberOfLines={1}
							>
								{acct?.handle}
							</Text>
							{IS_LOCKED && (
								<View style={{ marginLeft: 4 }}>
									<AppIcon
										id="lock-closed-outline"
										size={14}
										color={theme.secondary.a10}
									/>
								</View>
							)}
						</View>
					</View>
				</View>

				<ProfileDesc
					style={localStyles.parsedDescriptionContainer}
					rawContext={acct?.description}
					remoteSubdomain={acct?.instance}
					emojiMap={acct?.calculated?.emojis}
				/>

				<View style={localStyles.relationManagerSection}>
					<View style={{ flex: 1 }}>
						<RelationshipButtonCore userId={acct?.id} />
					</View>
					<View
						style={{
							backgroundColor: '#1b1b1b',
							padding: 8,
							borderRadius: appDimensions.buttons.borderRadius,
							marginHorizontal: 12,
							flex: 1,
							paddingVertical: 10,
						}}
					>
						<Text
							style={{
								fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
								color: theme.secondary.a10,
								textAlign: 'center',
								fontSize: 14,
							}}
						>
							Message
						</Text>
					</View>
					<Pressable
						style={{ paddingHorizontal: 12 }}
						onPress={onMoreOptionsPressed}
					>
						<AppIcon
							id={'ellipsis-v'}
							size={24}
							color={theme.secondary.a20}
							onPress={onMoreOptionsPressed}
						/>
					</Pressable>
				</View>

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
		borderRadius: 82 / 2,
		overflow: 'hidden',
	},
	avatarContainer: {
		width: 84,
		height: 84,
		borderColor: 'rgba(200, 200, 200, 0.24)',
		borderWidth: 3,
		borderRadius: 84 / 2,
		marginTop: -24,
		marginLeft: 6,
		overflow: 'hidden',
	},
	relationManagerSection: {
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 10,
		marginVertical: 24,
		marginBottom: 8,
	},
	secondSectionContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 8,
		marginLeft: 8,
		width: '100%',
	},
	ctaButtonContainer: {
		padding: 8,
		borderRadius: appDimensions.buttons.borderRadius,
		marginHorizontal: 12,
		paddingHorizontal: 16,
		flex: 1,
		paddingVertical: 10,
	},
});
