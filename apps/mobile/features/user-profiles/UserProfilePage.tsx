import { useLocalSearchParams } from 'expo-router';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { userProfileQueryOpts } from '@dhaaga/react';
import ProfileStatView from './view/ProfileStatView';
import ProfileAvatar from '#/components/common/user/fragments/ProfileAvatar';
import UserRelationPresenter from './presenters/UserRelationPresenter';
import { AppIcon } from '#/components/lib/Icon';
import { appDimensions } from '#/styles/dimensions';
import {
	useAppApiClient,
	useAppBottomSheet,
	useAppManager,
	useAppTheme,
} from '#/states/global/hooks';
import { TextContentView } from '#/components/common/status/TextContentView';
import Navbar_UserDetail from '#/components/shared/topnavbar/Navbar_UserDetail';
import { AppText } from '#/components/lib/Text';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useQuery } from '@tanstack/react-query';
import Animated, {
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from 'react-native-reanimated';
import UserArtGallery from '#/features/user-profiles/UserArtGallery';
import PagerView from 'react-native-pager-view';
import { useRef, useState } from 'react';
import UserProfilePostsView from '#/features/user-profiles/UserProfilePostsView';
import UserProfileStickyHeader from '#/features/user-profiles/UserProfileStickyHeader';
import UserProfileMiscellaneous from '#/features/user-profiles/UserProfileMiscellaneous';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import { DriverService } from '@dhaaga/bridge';
import UserProfileRepliesView from '#/features/user-profiles/UserProfileRepliesView';

const MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;
const TABS = ['gallery', 'pin-octicons', 'gallery', 'gallery'];

export function UserProfilePage() {
	const pagerRef = useRef(null);
	const listsRef = useRef([]);
	const [TabIndex, setTabIndex] = useState(0);
	const { client } = useAppApiClient();
	const { theme } = useAppTheme();
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data: acct, error } = useQuery(
		userProfileQueryOpts(
			client,
			DriverService.supportsAtProto(client.driver)
				? { use: 'did', did: id }
				: {
						use: 'userId',
						userId: id,
					},
		),
	);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GLOSSARY]);

	const fields = acct?.meta?.fields;
	const avatarUrl = acct?.avatarUrl;
	const bannerUrl = acct?.banner;

	const IS_LOCKED = acct?.meta?.isProfileLocked;

	const { show } = useAppBottomSheet();
	const { appManager } = useAppManager();

	function onMoreOptionsPressed() {
		if (!acct) return;
		appManager.storage.setUserId(acct.id);
		appManager.storage.setUserObject(acct);
		show(APP_BOTTOM_SHEET_ENUM.MORE_USER_ACTIONS, true);
	}

	const scrollY = useSharedValue(0);
	const headerHeight = useSharedValue(0);

	const profileId = acct?.id;
	const TAB_BAR_HEIGHT = 64;

	// store per-tab scroll offsets
	const scrollOffsets = useRef(TABS.map(() => 0));

	// dynamic list padding
	const listPadding = useAnimatedStyle(() => {
		return {
			paddingTop: headerHeight.value + TAB_BAR_HEIGHT,
		};
	});

	// sticky tab bar animation
	const tabBarStyle = useAnimatedStyle(() => {
		const clamped = Math.min(scrollY.value, headerHeight.value);
		return {
			top: headerHeight.value,
			transform: [{ translateY: -clamped }],
		};
	});

	// global scroll handler
	const onScroll = useAnimatedScrollHandler({
		onScroll: (e) => {
			scrollY.value = e.contentOffset.y;
		},
		onMomentumEnd: (e) => {
			scrollOffsets.current[TabIndex] = e.contentOffset.y;
		},
	});

	// header animation dynamic height
	const headerStyle = useAnimatedStyle(() => {
		const clamped = Math.min(scrollY.value, headerHeight.value);
		return {
			transform: [{ translateY: -clamped }],
		};
	});

	// switch tabs programmatically
	const switchToTab = (index) => {
		setTabIndex(index);

		pagerRef.current?.setPage(index);

		// restore scroll offset for that tab
		setTimeout(() => {
			const list = listsRef.current[index];
			if (!list) return;

			list.scrollToOffset({
				offset: scrollOffsets.current[index],
				animated: false,
			});
		}, 0);
	};

	function renderList(index: number) {
		switch (index) {
			case 0:
				return (
					<View key={index} style={{ flex: 1 }}>
						<UserProfilePostsView
							userId={profileId}
							onScroll={onScroll}
							animatedStyle={listPadding}
							headerHeight={headerHeight}
						/>
					</View>
				);
			case 1:
				return (
					<View
						key={index}
						style={{
							flex: 1,
						}}
					>
						<UserProfileRepliesView
							userId={profileId}
							onScroll={onScroll}
							animatedStyle={listPadding}
							headerHeight={headerHeight}
						/>
					</View>
				);
			case 2:
				return (
					<View key={2} style={{ flex: 1 }}>
						<UserArtGallery
							userId={profileId}
							onScroll={onScroll}
							animatedStyle={listPadding}
							headerHeight={headerHeight}
						/>
					</View>
				);
			case 3:
				return (
					<View key={3} style={{ flex: 1 }}>
						<UserProfileMiscellaneous
							userId={profileId}
							onScroll={onScroll}
							animatedStyle={listPadding}
						/>
					</View>
				);
		}
	}

	if (error)
		return <View style={{ flex: 1, backgroundColor: theme.background.a0 }} />;

	if (!acct)
		return <View style={{ flex: 1, backgroundColor: theme.background.a0 }} />;
	return (
		<View
			style={{
				backgroundColor: theme.palette.bg,
				flex: 1,
			}}
		>
			{/* DYNAMIC HEADER */}
			<Animated.View
				onLayout={(e) => {
					headerHeight.value = e.nativeEvent.layout.height;
				}}
				style={[
					{
						position: 'absolute',
						width: '100%',
						backgroundColor: '#242424',
						zIndex: 50,
						paddingBottom: 24,
					},
					headerStyle,
				]}
			>
				<Navbar_UserDetail acct={acct} />
				{bannerUrl ? (
					<Image
						source={{ uri: bannerUrl }}
						style={{ height: 128, width: Dimensions.get('window').width }}
					/>
				) : (
					<View
						style={{ height: 128, width: Dimensions.get('window').width }}
					/>
				)}
				<View style={{ marginHorizontal: 10 }}>
					<View
						style={{
							flexDirection: 'row',
							flex: 1,
							marginBottom: MARGIN_BOTTOM,
						}}
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
						<View style={{ flex: 1 }}>
							<UserRelationPresenter userId={acct?.id} />
						</View>
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
								{t(`verb.message`)}
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
			</Animated.View>

			<UserProfileStickyHeader
				TabIndex={TabIndex}
				changeTabIndex={switchToTab}
				animatedStyle={tabBarStyle}
			/>
			<PagerView
				ref={pagerRef}
				initialPage={0}
				style={{ flex: 1 }}
				onPageSelected={(e) => {
					const page = e.nativeEvent.position;
					setTabIndex(page);

					// restore scroll offset
					const target = listsRef.current[page];
					if (target) {
						target.scrollToOffset({
							offset: scrollOffsets.current[page],
							animated: false,
						});
					}
				}}
			>
				{TABS.map((tab, idx) => (
					<View key={idx} style={{ flex: 1 }}>
						{renderList(idx)}
					</View>
				))}
			</PagerView>
		</View>
	);
}

export default UserProfilePage;

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
