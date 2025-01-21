import {
	useAppDb,
	useAppDialog,
	useAppTheme,
	useHub,
} from '../../../hooks/utility/global-state-extractors';
import { useEffect, useReducer, useState } from 'react';
import {
	socialHubTabReducer as reducer,
	socialHubTabReducerActionType as ACTION,
	socialHubTabReducerDefault as reducerDefault,
} from '../../../states/interactors/social-hub-tab.reducer';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import HubProfileListView from '../views/HubProfileListView';
import PinnedTimelineListPresenter from './PinnedTimelineListPresenter';
import { Profile } from '../../../database/_schema';
import Header from '../components/Header';
import { ProfileService } from '../../../database/entities/profile';
import PinnedUserListPresenter from './PinnedUserListPresenter';
import PinnedTagListPresenter from './PinnedTagListPresenter';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';

type Props = {
	// account left join guaranteed
	profile: Profile;
};

/**
 * Tabs in the Social Hub interface
 * represent a unique profile each
 */
function SocialHubTabPresenter({ profile }: Props) {
	const { db } = useAppDb();
	const [State, dispatch] = useReducer(reducer, reducerDefault);
	const { theme } = useAppTheme();
	const [Refreshing, setRefreshing] = useState(false);
	const { show, hide } = useAppDialog();
	const { loadAccounts } = useHub();

	function refresh() {
		setRefreshing(true);
		dispatch({
			type: ACTION.RELOAD_PINS,
		});
		setRefreshing(false);
	}

	function hardRefresh() {
		dispatch({
			type: ACTION.INIT,
			payload: {
				db,
				profile: profile,
			},
		});
		dispatch({
			type: ACTION.RELOAD_PINS,
		});
	}

	useEffect(() => {
		hardRefresh();
	}, [profile, db]);

	const acct = ProfileService.getOwnerAccount(db, profile);

	function onPressAddProfile() {
		show(
			{
				title: 'Add Profile',
				actions: [],
				description: [
					'Profiles help you keep your pins and hub layout organised based on interest.',
				],
			},
			'Name your profile',
			(name: string) => {
				if (!!name) {
					const profile = ProfileService.addProfile(db, acct, name);
					console.log(profile);
					loadAccounts();
				}
			},
		);
	}

	function onPressProfile(profileId: number | string) {}

	function onLongPressProfile(profileId: number | string) {
		Haptics.impactAsync(ImpactFeedbackStyle.Medium);
		const _profile = ProfileService.getById(db, profileId);
		if (ProfileService.isDefaultProfile(db, _profile)) {
			show({
				title: 'Edit Profile',
				description: ['You can only rename a default profile.'],
				actions: [
					{
						label: 'Rename',
						onPress: async () => {
							show(
								{
									title: 'Rename Profile',
									actions: [],
									description: ['Assign a new name for this profile.'],
								},
								'Name your profile',
								(name: string) => {
									if (!!name) {
										ProfileService.renameProfileById(db, profileId, name);
										hide();
										loadAccounts();
									}
								},
							);
						},
					},
				],
			});
		} else {
			show({
				title: 'Edit Profile',
				description: ['You can rename or delete this profile'],
				actions: [
					{
						label: 'Rename',
						onPress: async () => {
							show(
								{
									title: 'Rename Profile',
									actions: [],
									description: ['Assign a new name for this profile.'],
								},
								'Name your profile',
								(name: string) => {
									if (!!name) {
										ProfileService.renameProfileById(db, profileId, name);
										hide();
										loadAccounts();
									}
								},
							);
						},
					},
					{
						label: 'Delete',
						onPress: async () => {
							show({
								title: 'Confirm Delete',
								description: [
									'Are you sure you want to delete this profile?',
									'All pins and saved layout will be lost.',
								],
								actions: [
									{
										label: 'Confirm and Delete',
										onPress: async () => {
											ProfileService.removeProfile(
												db,
												profileId as unknown as number,
											);
											hide();
											loadAccounts();
										},
										variant: 'destructive',
									},
								],
							});
						},
						variant: 'destructive',
					},
				],
			});
		}
	}

	return (
		<View>
			<ScrollView
				style={{
					backgroundColor: theme.palette.bg,
					height: '100%',
				}}
				refreshControl={
					<RefreshControl refreshing={Refreshing} onRefresh={refresh} />
				}
			>
				<Header acct={acct} />

				{/* --- Pinned Timelines --- */}
				<PinnedTimelineListPresenter
					account={State.acct}
					items={State.pins.timelines}
				/>

				{/* --- Pinned Users --- */}
				<PinnedUserListPresenter
					parentAcct={State.acct}
					items={State.pins.users}
				/>

				{/* --- Pinned Tags --- */}
				<PinnedTagListPresenter
					items={State.pins.tags}
					parentAcct={State.acct}
				/>
			</ScrollView>
			<Pressable
				style={{ position: 'absolute', bottom: 0, zIndex: 2 }}
				onPress={() => {}}
			>
				<HubProfileListView
					onLongPressProfile={onLongPressProfile}
					onPressAddProfile={onPressAddProfile}
					onPressProfile={onPressProfile}
				/>
			</Pressable>
		</View>
	);
}

export default SocialHubTabPresenter;
