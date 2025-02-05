import { useLocalSearchParams } from 'expo-router';
import {
	Animated,
	Dimensions,
	Pressable,
	StyleSheet,
	View,
} from 'react-native';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { Image } from 'expo-image';
import useGetProfile from '../api/useGetProfile';
import ProfileStatView from '../view/ProfileStatView';
import ProfileAvatar from '../../../components/common/user/fragments/ProfileAvatar';
import UserRelationPresenter from './UserRelationPresenter';
import UserProfileModulePresenter from './UserProfileModulePresenter';
import { AppIcon } from '../../../components/lib/Icon';
import { appDimensions } from '../../../styles/dimensions';
import {
	useAppBottomSheet,
	useAppManager,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { TextContentView } from '../../../components/common/status/TextContentView';
import UserViewNavbar from '../../../components/shared/topnavbar/UserViewNavbar';
import { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { AppText } from '../../../components/lib/Text';

const MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

export function ProfileContextWrapped() {
	const { theme } = useAppTheme();
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data: acct, error } = useGetProfile({ userId: id });

	const fields = acct?.meta?.fields;
	const avatarUrl = acct?.avatarUrl;
	const bannerUrl = acct?.banner;

	const IS_LOCKED = acct?.meta?.isProfileLocked;

	const { onScroll } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	const { show } = useAppBottomSheet();
	const { appManager } = useAppManager();

	function onMoreOptionsPressed() {
		if (!acct) return;
		appManager.storage.setUserId(acct.id);
		appManager.storage.setUserObject(acct);
		show(APP_BOTTOM_SHEET_ENUM.MORE_USER_ACTIONS, true);
	}

	function onModuleViewLayout(e: any) {
		console.log(e.nativeEvent.layout);
	}

	if (error || !acct) return <View />;

	return (
		<Animated.ScrollView
			onScroll={onScroll}
			contentContainerStyle={[{ backgroundColor: theme.palette.bg }]}
		>
			<UserViewNavbar acct={acct} />
			{bannerUrl ? (
				// @ts-ignore-next-line
				<Image
					source={{ uri: bannerUrl }}
					style={{ height: 128, width: Dimensions.get('window').width }}
				/>
			) : (
				<View style={{ height: 128, width: Dimensions.get('window').width }} />
			)}
			<View style={{ marginHorizontal: 10 }}>
				<View
					style={{ flexDirection: 'row', flex: 1, marginBottom: MARGIN_BOTTOM }}
				>
					<ProfileAvatar
						containerStyle={[localStyles.avatarContainer]}
						imageStyle={localStyles.avatarImageContainer}
						uri={avatarUrl}
					/>
					<ProfileStatView
						userId={acct?.id}
						postCount={acct?.stats?.posts}
						followingCount={acct?.stats?.following}
						followerCount={acct?.stats?.followers}
					/>
				</View>
				<View
					style={{
						marginBottom: MARGIN_BOTTOM,
					}}
				>
					<TextContentView
						tree={acct.parsedDisplayName}
						variant={'displayName'}
						mentions={[]}
						emojiMap={acct.calculated.emojis}
					/>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<AppText.Medium
							style={[{ color: theme.secondary.a30, fontSize: 13 }]}
							numberOfLines={1}
						>
							{acct?.handle}
						</AppText.Medium>
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

				<TextContentView
					tree={acct.parsedDescription}
					variant={'bodyContent'}
					mentions={[]}
					emojiMap={acct.calculated.emojis}
				/>

				<View style={localStyles.relationManagerSection}>
					<UserRelationPresenter userId={acct?.id} />
					<View
						style={{
							backgroundColor: theme.background.a20,
							borderRadius: appDimensions.buttons.borderRadius,
							marginHorizontal: 12,
							paddingVertical: 8,
							flex: 1,
						}}
					>
						<AppText.Medium
							style={{
								color: theme.secondary.a10,
								textAlign: 'center',
								fontSize: 16,
							}}
						>
							Message
						</AppText.Medium>
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
			</View>
			<View onLayout={onModuleViewLayout}>
				<UserProfileModulePresenter
					acct={acct}
					fields={fields}
					profileId={acct?.id}
				/>
			</View>
		</Animated.ScrollView>
	);
}

export default ProfileContextWrapped;

const localStyles = StyleSheet.create({
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
		marginVertical: 24,
		marginBottom: MARGIN_BOTTOM,
	},
});
