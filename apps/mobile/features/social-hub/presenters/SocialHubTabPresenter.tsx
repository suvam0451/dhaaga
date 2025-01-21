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
import FeedListPresenter from './FeedListPresenter';
import { Profile } from '../../../database/_schema';
import Header from '../components/Header';
import { ProfileService } from '../../../database/entities/profile';
import UserListPresenter from './UserListPresenter';
import TagListPresenter from './TagListPresenter';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

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
	const { accounts, selectProfile } = useHub();
	const { t } = useTranslation([
		LOCALIZATION_NAMESPACE.DIALOGS,
		LOCALIZATION_NAMESPACE.CORE,
	]);

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
				title: t(`hub.profileAdd.title`),
				actions: [],
				description: t(`hub.profileAdd.description`, {
					returnObjects: true,
				}) as string[],
			},
			t(`hub.profileAdd.placeholder`),
			(name: string) => {
				if (!!name) {
					ProfileService.addProfile(db, acct, name);
					loadAccounts();
				}
			},
		);
	}

	/**
	 * Switch to profile
	 */
	function onPressProfile(profileId: number | string) {
		const ownerIndex = accounts.findIndex((o) => o.id == acct.id);
		if (ownerIndex !== -1) {
			const _profileIndex = accounts[ownerIndex].profiles.findIndex(
				(o) => o.id == profileId,
			);
			if (_profileIndex !== -1) {
				selectProfile(_profileIndex);
			}
		}
	}

	function onLongPressProfile(profileId: number | string) {
		Haptics.impactAsync(ImpactFeedbackStyle.Medium);
		const _profile = ProfileService.getById(db, profileId);
		if (ProfileService.isDefaultProfile(db, _profile)) {
			show({
				title: t(`hub.profileEdit.title`),
				description: t(`hub.profileEdit.descriptionAlt`, {
					returnObjects: true,
				}) as string[],
				actions: [
					{
						label: t(`hub.profileEdit.renameOption`),
						onPress: async () => {
							show(
								{
									title: t(`hub.profileRename.title`),
									actions: [],
									description: t(`hub.profileRename.description`, {
										returnObjects: true,
									}) as string[],
								},
								t(`hub.profileRename.placeholder`),
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
				title: t(`hub.profileEdit.title`),
				description: t(`hub.profileEdit.description`, {
					returnObjects: true,
				}) as string[],
				actions: [
					{
						label: t(`hub.profileEdit.renameOption`),
						onPress: async () => {
							show(
								{
									title: t(`hub.profileRename.title`),
									actions: [],
									description: t(`hub.profileRename.description`, {
										returnObjects: true,
									}) as string[],
								},
								t(`hub.profileRename.placeholder`),
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
						label: t(`hub.profileEdit.deleteOption`),
						onPress: async () => {
							show({
								title: t(`hub.profileDelete.title`),
								description: t(`hub.profileDelete.description`, {
									returnObjects: true,
								}) as string[],
								actions: [
									{
										label: t(`hub.profileDelete.deleteConfirmOption`),
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
				<FeedListPresenter account={State.acct} items={State.pins.timelines} />

				{/* --- Pinned Users --- */}
				<UserListPresenter parentAcct={State.acct} items={State.pins.users} />

				{/* --- Pinned Tags --- */}
				<TagListPresenter items={State.pins.tags} parentAcct={State.acct} />
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
