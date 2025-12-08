import { useMemo, useRef, useState } from 'react';
import ProfileGalleryModePresenter from '../features/gallery-mode/presenters/ProfileGalleryModePresenter';
import { StyleProp, View, ViewStyle, Dimensions, FlatList } from 'react-native';
import type { UserObjectType } from '@dhaaga/bridge/typings';
import { AppInstagramTabControl } from '#/components/lib/SegmentedControl';
import useApiGetPinnedPosts from '#/hooks/api/accounts/useApiGetPinnedPosts';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { AppText } from '#/components/lib/Text';
import StatusItem from '#/features/post-view/StatusItem';
import WithAppStatusItemContext from '#/components/containers/contexts/WithPostItemContext';
import { appDimensions } from '#/styles/dimensions';
import UserArtGallery from '#/features/user-profiles/UserArtGallery';
import Animated, {
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';

type AppPagerViewListProps = {
	userId: string;
	previewedAcct: UserObjectType;
};

const TAB_BAR_HEIGHT = 48;
const HEADER_HEIGHT = 220;

const TABS = ['gallery', 'pin-octicons', 'gallery'];

function ProfilePinnedPosts({ userId }: AppPagerViewListProps) {
	const { data, error, isFetched } = useApiGetPinnedPosts(userId);
	const ref = useRef<FlatList>(null);

	if (error) {
		console.log('[ERROR]: profile pinned posts', error);
		return <View />;
	}

	if (!isFetched) return <View />;
	if (isFetched && data.length === 0)
		return (
			<View>
				<AppText.Medium style={{ fontSize: 18 }}>
					This user does not have any pinned posts
				</AppText.Medium>
			</View>
		);

	return (
		<View style={{ marginTop: 8 }}>
			<FlatList
				ref={ref}
				data={data}
				renderItem={({ item }) => (
					<WithAppStatusItemContext dto={item}>
						<StatusItem isPin />
					</WithAppStatusItemContext>
				)}
			/>
		</View>
	);
}

type ProfileModulesProps = {
	acct: UserObjectType;
	profileId: string;
	fields: any[];
	style?: StyleProp<ViewStyle>;
};

/**
 * Various modules available
 * in profile page that can be
 * expanded
 */
function UserProfileModulePresenter({ profileId, acct }: ProfileModulesProps) {
	const { theme } = useAppTheme();
	const [TabIndex, setTabIndex] = useState(0);

	const Content = useMemo(() => {
		switch (TabIndex) {
			case 0:
				return (
					<View
						style={{
							// 54 for bottom menu, 64 for profile module menu
							height: Dimensions.get('window').height - 54 - 64,
						}}
					>
						<ProfileGalleryModePresenter userId={profileId} />;
					</View>
				);

			case 1:
				return (
					<View
						style={{
							// 54 for bottom menu, 64 for profile module menu
							minHeight: Dimensions.get('window').height - 54 - 64,
							paddingBottom: 32,
						}}
					>
						<ProfilePinnedPosts previewedAcct={acct} userId={profileId} />
					</View>
				);
			case 2:
				return <UserArtGallery userId={profileId} />;
			default:
				return null;
		}
	}, [TabIndex, profileId]);

	// main scroll state
	const scrollY = useSharedValue(0);
	const headerHeight = useSharedValue(0);

	// track selected tab
	const [activeTab, setActiveTab] = useState(0);

	// store refs to each FlatList
	const listsRef = useRef([]);

	// store per-tab scroll offsets
	const scrollOffsets = useRef(TABS.map(() => 0));

	// global scroll handler
	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (e) => {
			scrollY.value = e.contentOffset.y;
		},
		onMomentumEnd: (e) => {
			scrollOffsets.current[activeTab] = e.contentOffset.y;
		},
	});

	// sticky tab bar animation
	const tabBarAnim = useAnimatedStyle(() => {
		const translateY = -Math.min(scrollY.value, HEADER_HEIGHT);
		return {
			transform: [{ translateY }],
		};
	});

	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					marginTop: 12,
					marginHorizontal: 10,
				}}
			>
				<Animated.View
					style={[
						{
							height: TAB_BAR_HEIGHT,
							width: '100%',
							top: HEADER_HEIGHT,
							backgroundColor: '#181818',
							flexDirection: 'row',
							borderBottomWidth: 1,
							borderColor: '#333',
							zIndex: 20,
						},
						// tabBarAnim,
					]}
				>
					<AppInstagramTabControl
						tabIcons={['gallery', 'pin-octicons', 'gallery']}
						index={TabIndex}
						onIndexChange={setTabIndex}
						style={{
							backgroundColor: theme.background.a20,
							paddingTop: 8,
							marginBottom: appDimensions.timelines.sectionBottomMargin,
							borderRadius: 8,
						}}
					/>
				</Animated.View>
			</View>
			<PagerView
				scrollEnabled={true}
				initialPage={0}
				style={{ flex: 1, height: 400 }}
			>
				<View
					key={0}
					style={
						{
							// 54 for bottom menu, 64 for profile module menu
							// height: Dimensions.get('window').height - 54 - 64,
						}
					}
				>
					<ProfileGalleryModePresenter userId={profileId} />;
				</View>
				<View
					key={1}
					style={{
						// 54 for bottom menu, 64 for profile module menu
						minHeight: Dimensions.get('window').height - 54 - 64,
						paddingBottom: 32,
					}}
				>
					<ProfilePinnedPosts previewedAcct={acct} userId={profileId} />
				</View>
				<View key={2}>
					<UserArtGallery userId={profileId} />
				</View>
			</PagerView>
		</View>
	);
}

export default UserProfileModulePresenter;
