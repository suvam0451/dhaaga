import {
	useAppAcct,
	useAppBottomSheet,
	useAppDb,
	useAppDialog,
	useAppGlobalStateActions,
	useAppTheme,
	useHub,
} from '../../../hooks/utility/global-state-extractors';
import { useEffect, useReducer, useState } from 'react';
import {
	socialHubTabReducer as reducer,
	socialHubTabReducerActionType as ACTION,
	socialHubTabReducerDefault as reducerDefault,
} from '../../../states/interactors/social-hub-tab.reducer';
import { RefreshControl, ScrollView, View } from 'react-native';
import HubProfileListView from '../views/HubProfileListView';
import FeedListPresenter from './FeedListPresenter';
import { Profile, ProfilePinnedTag, ProfilePinnedUser } from '@dhaaga/db';
import NavBar_Hub from '#/components/shared/topnavbar/NavBar_Hub';
import {
	ProfileService,
	ProfilePinnedUserService,
	ProfilePinnedTagService,
	AccountService,
} from '@dhaaga/db';
import UserListPresenter from './UserListPresenter';
import TagListPresenter from './TagListPresenter';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { DialogBuilderService } from '../../../services/dialog-builder.service';
import ComposeButton from '#/components/widgets/ComposeButton';

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
	const { profiles, selectProfile } = useHub();
	const { setCtx, show: showSheet } = useAppBottomSheet();
	const { acct } = useAppAcct();
	const { restoreSession } = useAppGlobalStateActions();
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

	const parentAcct = ProfileService.getOwnerAccount(db, profile);

	function onPressAddFeed() {
		setCtx({ profileId: profile.id, onChange: refresh });
		showSheet(APP_BOTTOM_SHEET_ENUM.ADD_HUB_FEED, true);
	}

	function onPressAddUser() {
		if (parentAcct.id !== acct.id) {
			show(
				DialogBuilderService.toSwitchActiveAccount(() => {
					AccountService.select(db, parentAcct);
					try {
						restoreSession().then(() => {
							hide();
							setCtx({ profileId: profile.id, onChange: refresh });
							showSheet(APP_BOTTOM_SHEET_ENUM.ADD_HUB_USER, true);
						});
					} catch (e) {
						hide();
					}
				}),
			);
		} else {
			setCtx({ profileId: profile.id, onChange: refresh });
			showSheet(APP_BOTTOM_SHEET_ENUM.ADD_HUB_USER, true);
		}
	}

	function onPressAddTag() {
		show(
			{
				title: t(`hub.tagAdd.title`),
				description: t(`hub.tagAdd.description`, {
					returnObjects: true,
				}) as string[],
				actions: [],
			},
			t(`hub.tagAdd.placeholder`),
			(text: string) => {
				ProfilePinnedTagService.add(db, acct, profile, text);
				refresh();
			},
		);
	}

	function onLongPressUser(pinnedUser: ProfilePinnedUser) {
		Haptics.impactAsync(ImpactFeedbackStyle.Medium);
		show({
			title: t(`hub.userEdit.title`),
			description: t(`hub.userEdit.description`, {
				returnObjects: true,
			}) as string[],
			actions: [
				{
					label: t(`dialogs.deleteOption`, { ns: LOCALIZATION_NAMESPACE.CORE }),
					variant: 'destructive',
					onPress: async () => {
						ProfilePinnedUserService.toggle(db, pinnedUser);
						refresh();
						hide();
					},
				},
			],
		});
	}

	function onLongPressTag(pinnedTag: ProfilePinnedTag) {
		Haptics.impactAsync(ImpactFeedbackStyle.Medium);
		show({
			title: t(`hub.tagEdit.title`),
			description: t(`hub.tagEdit.description`, {
				returnObjects: true,
			}) as string[],
			actions: [
				{
					label: t(`dialogs.renameOption`, { ns: LOCALIZATION_NAMESPACE.CORE }),
					onPress: async () => {
						show(
							{
								title: t(`hub.tagRename.title`),
								actions: [],
								description: t(`hub.tagRename.description`, {
									returnObjects: true,
								}) as string[],
							},
							t(`hub.tagRename.placeholder`),
							(name: string) => {
								if (!!name) {
									ProfilePinnedTagService.renameById(db, pinnedTag.id, name);
									hide();
									refresh();
								}
							},
						);
					},
				},
				{
					label: t(`dialogs.deleteOption`, { ns: LOCALIZATION_NAMESPACE.CORE }),
					onPress: async () => {
						ProfilePinnedTagService.delete(db, pinnedTag.id);
						hide();
						refresh();
					},
					variant: 'destructive',
				},
			],
		});
	}

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
					ProfileService.addProfile(db, parentAcct, name);
					loadAccounts();
				}
			},
		);
	}

	/**
	 * Switch to profile
	 */
	function onPressProfile(profileId: number | string) {
		const _profileIndex = profiles.findIndex((o) => o.id == profileId);
		if (_profileIndex !== -1) {
			selectProfile(_profileIndex);
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
						label: t(`dialogs.renameOption`, {
							ns: LOCALIZATION_NAMESPACE.CORE,
						}),
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
				<NavBar_Hub acct={parentAcct} />

				{/* --- Pinned Timelines --- */}
				<FeedListPresenter
					account={State.acct}
					items={State.pins.timelines}
					onPressAddFeed={onPressAddFeed}
				/>

				{/* --- Pinned Users --- */}
				<UserListPresenter
					parentAcct={State.acct}
					items={State.pins.users}
					profile={profile}
					onPressAddUser={onPressAddUser}
					onLongPressUser={onLongPressUser}
				/>

				{/* --- Pinned Tags --- */}
				<TagListPresenter
					items={State.pins.tags}
					parentAcct={State.acct}
					onPressAddTag={onPressAddTag}
					onLongPressTag={onLongPressTag}
				/>
			</ScrollView>

			<HubProfileListView
				onLongPressProfile={onLongPressProfile}
				onPressAddProfile={onPressAddProfile}
				onPressProfile={onPressProfile}
			/>
			<ComposeButton />
		</View>
	);
}

export default SocialHubTabPresenter;
