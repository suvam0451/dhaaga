import {
	Pressable,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { useEffect, useReducer, useState } from 'react';
import useSocialHub from '../../../states/useSocialHub';
import { Account } from '../../../database/_schema';
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
import { TimeOfDayGreeting } from '../../../app/(tabs)/index';
import { AppPagerView } from '../../lib/AppPagerView';

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
			<View style={{ marginTop: 128 }}>
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

				<Pressable
					style={[
						styles.addTabCtaContainer,
						{
							backgroundColor: theme.primary.a0,
						},
					]}
					onPress={() => {
						router.navigate(APP_ROUTING_ENUM.SETTINGS_TAB_ACCOUNTS);
					}}
				>
					<Text
						style={[
							styles.addTabCtaText,
							{
								color: 'black',
							},
						]}
					>
						Add Account
					</Text>
				</Pressable>
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
	account: Account;
};

/**
 * Tabs in the Social Hub interface
 * represent a unique profile each
 */
function SocialHubTab({ account }: SocialHubTabProps) {
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
				acct: account,
			},
		});
		dispatch({
			type: socialHubTabReducerActionType.RELOAD_PINS,
		});
	}, [account]);

	function refresh() {
		setIsRefreshing(true);
		dispatch({
			type: socialHubTabReducerActionType.RELOAD_PINS,
		});
		setIsRefreshing(false);
	}

	if (State.profiles.length === 0) return <View />;
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
			<View style={{ marginBottom: 16 }}>
				<TimeOfDayGreeting acct={account} />
			</View>

			<View style={{ marginHorizontal: 10 }}>
				<AppSegmentedControl
					items={[{ label: 'Pinned' }, { label: 'Saved' }]}
					style={{ marginTop: 8 }}
					leftDecorator={
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<SocialHubAvatarCircle
								size={36}
								style={{ marginRight: 6 }}
								acct={account}
							/>
						</View>
					}
					index={Index}
					setIndex={setIndex}
				/>
			</View>

			{/* --- Pinned Timelines --- */}
			<SocialHubPinnedTimelines
				account={State.acct}
				items={State.profiles[0].pins.timelines}
			/>

			{/* --- Pinned Users --- */}
			<SocialHubPinSectionContainer
				label={'Users'}
				style={{
					marginTop: 16,
				}}
			>
				<AppFlashList.PinnedProfiles
					account={State.acct}
					data={State.profiles[0].pins.users}
				/>
			</SocialHubPinSectionContainer>

			{/* --- Pinned Tags --- */}
			<SocialHubPinSectionContainer
				label={'Tags'}
				style={{
					marginTop: 16,
				}}
			>
				<AppFlashList.PinnedTags data={State.profiles[0].pins.tags} />
			</SocialHubPinSectionContainer>
		</ScrollView>
	);
}

function SocialHub() {
	const { data } = useSocialHub();

	function renderScene(index: number) {
		if (index >= data.accounts.length) return <SocialHubTabAdd />;
		if (!data.accounts[index]) return <View />;
		return <SocialHubTab account={data.accounts[index]} />;
	}

	return (
		<AppPagerView
			renderFunction={renderScene}
			pageCount={data.accounts.length + 1}
		/>
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
