import {
	Pressable,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { Profile } from '../../../database/_schema';
import {
	socialHubTabReducer,
	socialHubTabReducerActionType,
	socialHubTabReducerDefault,
} from '../../../states/interactors/social-hub-tab.reducer';
import SocialHubPinnedTimelines from './stack/landing/fragments/SocialHubPinnedTimelines';
import {
	useAppDb,
	useAppTheme,
	useHub,
} from '../../../hooks/utility/global-state-extractors';
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
import { BottomNavBarInfinite } from '../../shared/pager-view/BottomNavBar';
import { ProfileService } from '../../../database/entities/profile';

function Header({ profile }: { profile: Profile }) {
	const [Acct, setAcct] = useState(null);
	const { db } = useAppDb();

	useEffect(() => {
		setAcct(ProfileService.getOwnerAccount(db, profile));
	}, [profile]);

	return (
		<AppTabLandingNavbar
			type={APP_LANDING_PAGE_TYPE.HOME}
			menuItems={[
				{
					iconId: 'layers-outline',
					onPress: () => {},
				},

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
						router.navigate(APP_ROUTING_ENUM.PROFILES);
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
						Add Profile
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
	// account left join guaranteed
	profile: Profile;
};

/**
 * Tabs in the Social Hub interface
 * represent a unique profile each
 */
function SocialHubTab({ profile }: SocialHubTabProps) {
	const { db } = useAppDb();
	const [State, dispatch] = useReducer(
		socialHubTabReducer,
		socialHubTabReducerDefault,
	);
	const { theme } = useAppTheme();
	const [IsRefreshing, setIsRefreshing] = useState(false);

	useEffect(() => {
		dispatch({
			type: socialHubTabReducerActionType.INIT,
			payload: {
				db,
				profile: profile,
			},
		});
		dispatch({
			type: socialHubTabReducerActionType.RELOAD_PINS,
		});
	}, [profile, db]);

	function refresh() {
		setIsRefreshing(true);
		dispatch({
			type: socialHubTabReducerActionType.RELOAD_PINS,
		});
		setIsRefreshing(false);
	}

	return (
		<ScrollView
			style={{
				backgroundColor: theme.palette.bg,
				height: '100%',
			}}
			contentContainerStyle={{
				// for the selection bar
				paddingBottom: 50,
			}}
			refreshControl={
				<RefreshControl refreshing={IsRefreshing} onRefresh={refresh} />
			}
		>
			<Header profile={profile} />
			<View style={{ marginBottom: 16 }}>
				<TimeOfDayGreeting acct={State.acct} />
			</View>

			{/* --- Pinned Timelines --- */}
			<SocialHubPinnedTimelines
				account={State.acct}
				items={State.pins.timelines}
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
					data={State.pins.users}
				/>
			</SocialHubPinSectionContainer>

			{/* --- Pinned Tags --- */}
			<SocialHubPinSectionContainer
				label={'Tags'}
				style={{
					marginTop: 16,
				}}
			>
				<AppFlashList.PinnedTags data={State.pins.tags} />
			</SocialHubPinSectionContainer>
		</ScrollView>
	);
}

function SocialHub() {
	const { theme } = useAppTheme();
	const { accounts, loadNext, loadPrev, navigation, selectProfile } = useHub();

	const tabLabels = useMemo(() => {
		if (navigation.accountIndex === -1 || navigation.profileIndex === -1)
			return [{ label: 'New +', id: '__add__' }];
		if (navigation.accountIndex === accounts.length)
			return [{ label: 'New +', id: '__add__' }];

		return [
			...accounts[navigation.accountIndex].profiles.map((o) => ({
				label: o.name,
				id: o.id.toString(),
			})),
			{ label: 'Add +', id: '__add__' },
		];
	}, [accounts, navigation]);

	const onChipSelect = (index: number) => {
		selectProfile(index);
	};

	const HubComponent = useMemo(() => {
		if (navigation.accountIndex === -1 || navigation.profileIndex === -1)
			return <SocialHubTabAdd />;
		if (navigation.accountIndex === accounts.length) return <SocialHubTabAdd />;
		if (
			navigation.profileIndex ===
			accounts[navigation.accountIndex].profiles.length
		)
			return <SocialHubTabAdd />;

		return (
			<SocialHubTab
				profile={
					accounts[navigation.accountIndex].profiles[navigation.profileIndex]
				}
			/>
		);
	}, [accounts, navigation]);

	return (
		<View style={{ backgroundColor: theme.palette.bg, height: '100%' }}>
			{HubComponent}
			<BottomNavBarInfinite
				Index={navigation.profileIndex}
				setIndex={onChipSelect}
				items={tabLabels}
				loadNext={loadNext}
				loadPrev={loadPrev}
			/>
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
