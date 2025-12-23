import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { userProfileQueryOpts } from '@dhaaga/react';
import { useAppApiClient, useAppTheme } from '#/states/global/hooks';
import { useQuery } from '@tanstack/react-query';
import UserArtGallery from '#/features/user-profiles/modules/UserArtGallery';
import PagerView from 'react-native-pager-view';
import UserProfilePostsView from '#/features/user-profiles/modules/UserProfilePostsView';
import UserProfilePagerWidget from '#/features/user-profiles/components/UserProfilePagerWidget';
import UserProfileMiscView from '#/features/user-profiles/modules/UserProfileMiscView';
import { DriverService } from '@dhaaga/bridge';
import UserProfileRepliesView from '#/features/user-profiles/modules/UserProfileRepliesView';
import useCollapsibleHeaderWithStickyPagerViewTabs from '#/ui/anim/useCollapsibleHeaderWithStickyPagerViewTabs';
import UserProfileHeaderCard from '#/features/user-profiles/components/UserProfileHeaderCard';
import WithBackgroundSkin from '#/components/containers/WithBackgroundSkin';

const TABS = ['gallery', 'pin-octicons', 'gallery', 'gallery'];

export function UserProfilePage() {
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

	const profileId = acct?.id;

	const {
		tabIndex,
		onScroll,
		tabBarStyle,
		headerStyle,
		switchToTab,
		headerHeight,
		onLayout,
		pagerRef,
		listsRef,
	} = useCollapsibleHeaderWithStickyPagerViewTabs(4);

	function renderList(index: number) {
		switch (index) {
			case 0:
				return (
					<UserProfilePostsView
						forwardedRef={(ref: any) => {
							listsRef.current[index] = ref;
						}}
						userId={profileId}
						onScroll={onScroll}
						headerHeight={headerHeight}
					/>
				);
			case 1:
				return (
					<UserProfileRepliesView
						forwardedRef={(ref: any) => {
							listsRef.current[index] = ref;
						}}
						userId={profileId}
						onScroll={onScroll}
						headerHeight={headerHeight}
					/>
				);
			case 2:
				return (
					<UserArtGallery
						forwardedRef={(ref: any) => {
							listsRef.current[index] = ref;
						}}
						userId={profileId}
						headerHeight={headerHeight}
						onScroll={onScroll}
					/>
				);
			case 3:
				return (
					<UserProfileMiscView
						forwardedRef={(ref: any) => {
							listsRef.current[index] = ref;
						}}
						userId={profileId}
						onScroll={onScroll}
						headerHeight={headerHeight}
					/>
				);
		}
	}

	if (error)
		return <View style={{ flex: 1, backgroundColor: theme.background.a0 }} />;

	if (!acct)
		return <View style={{ flex: 1, backgroundColor: theme.background.a0 }} />;
	return (
		<WithBackgroundSkin>
			{/* DYNAMIC HEADER */}
			<UserProfileHeaderCard
				acct={acct}
				animatedStyle={headerStyle}
				onLayout={onLayout}
			/>
			<UserProfilePagerWidget
				TabIndex={tabIndex}
				changeTabIndex={switchToTab}
				animatedStyle={tabBarStyle}
			/>
			<PagerView
				ref={pagerRef}
				initialPage={0}
				style={{ flex: 1 }}
				onPageSelected={(e) => {
					const page = e.nativeEvent.position;
					switchToTab(page);
				}}
			>
				{TABS.map((_, idx) => (
					<View key={idx} style={{ flex: 1 }}>
						{renderList(idx)}
					</View>
				))}
			</PagerView>
		</WithBackgroundSkin>
	);
}

export default UserProfilePage;
