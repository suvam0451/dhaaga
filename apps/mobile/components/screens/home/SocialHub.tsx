import {
	Pressable,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { useEffect, useReducer, useRef, useState } from 'react';
import useSocialHub from '../../../states/useSocialHub';
import { Profile } from '../../../database/_schema';
import {
	socialHubTabReducer,
	socialHubTabReducerActionType,
	socialHubTabReducerDefault,
} from '../../../states/reducers/social-hub-tab.reducer';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import SocialHubPinnedTimelines from './stack/landing/fragments/SocialHubPinnedTimelines';
import { AppSegmentedControl } from '../../lib/SegmentedControl';
import { SocialHubAvatarCircle } from '../../lib/Avatar';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../shared/topnavbar/AppTabLandingNavbar';
import { router } from 'expo-router';
import { APP_FONTS } from '../../../styles/AppFonts';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';
import { SocialHubPinSectionContainer } from './stack/landing/fragments/_factory';
import { AppFlashList } from '../../lib/AppFlashList';

function Header() {
	return (
		<AppTabLandingNavbar
			type={APP_LANDING_PAGE_TYPE.HOME}
			menuItems={[
				{
					iconId: 'user-guide',
					onPress: () => {
						router.push('/user-guide');
					},
				},
			]}
		/>
	);
}

/**
 * The last tab of the Social Hub
 * is always a UI to add a new profile
 */
function SocialHubTabAdd() {
	const { theme } = useAppTheme();

	function onGuideRequested() {
		router.navigate(APP_ROUTING_ENUM.GUIDE_NEW_TAB_INTERFACE);
	}

	return (
		<ScrollView
			style={{
				backgroundColor: theme.palette.bg,
				height: '100%',
				minHeight: '100%',
			}}
		>
			<AppTabLandingNavbar
				type={APP_LANDING_PAGE_TYPE.SOCIAL_HUB_ADD_TAB}
				menuItems={[
					{
						iconId: 'user-guide',
						onPress: () => {
							router.push('/user-guide');
						},
					},
				]}
			/>
			<View style={{ flexGrow: 1, flex: 1 }} />
			<View style={{ marginTop: 128, flex: 1 }}>
				<View
					style={{
						alignSelf: 'center',
						justifyContent: 'center',
						maxWidth: 256,
					}}
				>
					<Ionicons
						name={'add-circle-outline'}
						size={128}
						color={theme.primary.a0}
					/>
				</View>

				<View
					style={[
						styles.addTabCtaContainer,
						{
							backgroundColor: theme.primary.a0,
						},
					]}
				>
					<Text
						style={[
							styles.addTabCtaText,
							{
								color: 'black',
							},
						]}
					>
						Add Profile
					</Text>
				</View>
				<Pressable
					style={{
						alignSelf: 'center',
						marginTop: 20,
						padding: 12,
					}}
					onPress={onGuideRequested}
				>
					<Text
						style={[
							styles.addTabCtaDesc,
							{
								color: theme.secondary.a20,
							},
						]}
					>
						How does this work?
					</Text>
				</Pressable>
			</View>
		</ScrollView>
	);
}

type SocialHubTabProps = {
	profile: Profile;
};

/**
 * Tabs in the Social Hub interface
 * represent a unique profile each
 */
function SocialHubTab({ profile }: SocialHubTabProps) {
	const { db } = useGlobalState(
		useShallow((o) => ({
			db: o.db,
		})),
	);
	const [State, dispatch] = useReducer(
		socialHubTabReducer,
		socialHubTabReducerDefault,
	);
	const { theme } = useAppTheme();
	const [Index, setIndex] = useState(0);
	const [IsRefreshing, setIsRefreshing] = useState(false);

	useEffect(() => {
		dispatch({
			type: socialHubTabReducerActionType.INIT,
			payload: {
				db,
				profile,
			},
		});
		dispatch({
			type: socialHubTabReducerActionType.LOAD_PINS,
		});
	}, [profile]);

	function refresh() {
		setIsRefreshing(true);
		dispatch({
			type: socialHubTabReducerActionType.LOAD_PINS,
		});
		setIsRefreshing(false);
	}

	return (
		<ScrollView
			style={{
				backgroundColor: theme.palette.bg,
				height: '100%',
			}}
			refreshControl={
				<RefreshControl refreshing={IsRefreshing} onRefresh={refresh} />
			}
		>
			<Header />
			<View style={{ marginHorizontal: 10 }}>
				<AppSegmentedControl
					items={[
						{ label: 'Pinned' },
						{ label: 'Saved' },
						{ label: 'For You' },
					]}
					style={{ marginTop: 8 }}
					leftDecorator={
						<SocialHubAvatarCircle size={36} style={{ marginRight: 6 }} />
					}
					index={Index}
					setIndex={setIndex}
				/>
			</View>

			{/* --- Pinned Timelines --- */}
			<SocialHubPinnedTimelines
				items={State.pinned.timelines}
				refresh={refresh}
				isRefreshing={IsRefreshing}
				dispatch={dispatch}
			/>

			{/* --- Pinned Users --- */}
			<SocialHubPinSectionContainer
				label={'Profiles'}
				style={{
					marginTop: 16,
				}}
			>
				<AppFlashList.PinnedProfiles data={State.pinned.users} />
			</SocialHubPinSectionContainer>

			{/* --- Pinned Tags --- */}
			<SocialHubPinSectionContainer
				label={'Tags'}
				style={{
					marginTop: 16,
				}}
			>
				<AppFlashList.PinnedTags data={State.pinned.tags} />
			</SocialHubPinSectionContainer>
		</ScrollView>
	);
}

function SocialHub() {
	const ref = useRef<PagerView>(null);

	const { data, index } = useSocialHub();

	function onPageSelected(e: any) {
		const { offset, position } = e.nativeEvent;
		const newIndex = Math.round(position + offset);
		// setIndex(newIndex);
	}

	function renderScene(index: number) {
		if (index >= data.profiles.length) return <SocialHubTabAdd />;
		if (!data.profiles[index]) return <View />;
		return <SocialHubTab profile={data.profiles[index]} />;
	}

	return (
		<View style={{ height: '100%' }}>
			<PagerView
				ref={ref}
				scrollEnabled={true}
				style={styles.pagerView}
				initialPage={index}
				onPageScroll={onPageSelected}
			>
				{Array.from({ length: data.profiles.length + 1 }).map((_, index) => (
					<View key={index.toString()}>{renderScene(index)}</View>
				))}
			</PagerView>
		</View>
	);
}

export default SocialHub;

const styles = StyleSheet.create({
	pagerView: {
		flex: 1,
	},
	addTabCtaContainer: {
		alignItems: 'center',
		borderRadius: 8,
		padding: 8,
		paddingHorizontal: 12,
		maxWidth: 256,
		alignSelf: 'center',
		marginTop: 24,
	},
	addTabCtaText: {
		fontSize: 20,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		textAlign: 'center',
	},
	addTabCtaDesc: {
		fontSize: 18,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
	},
});
