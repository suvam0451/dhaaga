import { useLocalSearchParams } from 'expo-router';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import useScrollMoreOnPageEnd from '../../../../../states/useScrollMoreOnPageEnd';
import { Image } from 'expo-image';
import useMfm from '../../../../hooks/useMfm';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import useGetProfile from '../../../../../hooks/api/accounts/useGetProfile';
import styles from '../../../../common/user/utils/styles';
import ProfileStats from './fragments/ProfileStats';
import ProfileAvatar from '../../../../common/user/fragments/ProfileAvatar';
import ProfileDesc from '../../../../common/user/fragments/ProfileDesc';
import AntDesign from '@expo/vector-icons/AntDesign';
import RelationshipButtonCore from '../../../../common/relationship/RelationshipButtonCore';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../shared/topnavbar/AppTopNavbar';
import ProfileModules from './modules/ProfileModules';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../../utils/theming.util';
import { AppIcon } from '../../../../lib/Icon';
import { appDimensions } from '../../../../../styles/dimensions';

export function ProfileContextWrapped() {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
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
					<ProfileStats
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
									<AntDesign
										name="lock1"
										size={14}
										color={APP_FONT.MONTSERRAT_BODY}
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
					<RelationshipButtonCore userId={acct?.id} />
					<View
						style={{
							backgroundColor: '#1b1b1b',
							padding: 8,
							borderRadius: appDimensions.buttons.borderRadius,
							marginHorizontal: 12,
							paddingHorizontal: 16,
							flex: 1,
							paddingVertical: 10,
						}}
					>
						<Text
							style={{
								fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
								color: theme.secondary.a10,
								textAlign: 'center',
								fontSize: 16,
							}}
						>
							Message
						</Text>
					</View>
					<View></View>
					<AppIcon id={'ellipsis-v'} size={28} />
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
	},
	relationManagerSection: {
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 10,
		marginTop: 8,
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
