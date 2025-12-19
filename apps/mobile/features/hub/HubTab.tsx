import {
	useActiveUserSession,
	useAppBottomSheet,
	useAppDb,
	useAppDialog,
	useAppTheme,
	useHub,
} from '#/states/global/hooks';
import { useEffect, useReducer, useState } from 'react';
import {
	socialHubTabReducer as reducer,
	socialHubTabReducerActionType as ACTION,
	socialHubTabReducerDefault as reducerDefault,
} from '#/states/interactors/social-hub-tab.reducer';
import { RefreshControl, ScrollView, View } from 'react-native';
import HubProfileListView from './views/HubProfileListView';
import HubPinnedFeedList from './components/HubPinnedFeedList';
import { Profile, ProfilePinnedTag, ProfilePinnedUser } from '@dhaaga/db';
import NavBar_Hub from '#/components/topnavbar/NavBar_Hub';
import {
	ProfileService,
	ProfilePinnedUserService,
	ProfilePinnedTagService,
} from '@dhaaga/db';
import HubPinnedUserList from './components/HubPinnedUserList';
import HubPinnedTagList from './components/HubPinnedTagList';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import { appDimensions } from '#/styles/dimensions';

type Props = {
	// account left join guaranteed
	profile: Profile;
};

/**
 * Tabs in the Social Hub interface
 * represent a unique profile each
 */
function HubTab({ profile }: Props) {
	const { db } = useAppDb();
	const [State, dispatch] = useReducer(reducer, reducerDefault);
	const { theme } = useAppTheme();
	const [Refreshing, setRefreshing] = useState(false);
	const { show, hide } = useAppDialog();
	const { loadAccounts } = useHub();
	const { profiles, selectProfile } = useHub();
	const { show: showSheet } = useAppBottomSheet();
	const { acct } = useActiveUserSession();
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
		showSheet(APP_BOTTOM_SHEET_ENUM.ADD_HUB_FEED, true, {
			$type: 'profile-id',
			profileId: profile.id,
			callback: refresh,
		});
	}

	function onPressAddUser() {
		showSheet(APP_BOTTOM_SHEET_ENUM.ADD_HUB_USER, true, {
			$type: 'profile-id',
			profileId: profile.id,
			callback: refresh,
		});
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
			{ $type: 'text-prompt', placeholder: t(`hub.tagAdd.placeholder`) },
			(ctx) => {
				if (ctx.$type !== 'text-prompt') return;
				ProfilePinnedTagService.add(db, acct, profile, ctx.userInput as string);
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
							{
								$type: 'text-prompt',
								placeholder: t(`hub.tagRename.placeholder`),
							},
							(ctx) => {
								if (ctx.$type !== 'text-prompt') return;
								if (!ctx.userInput) return;
								const name = (ctx.userInput as string).trim();
								ProfilePinnedTagService.renameById(db, pinnedTag.id, name);
								refresh();
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
			{ $type: 'text-prompt', placeholder: t(`hub.profileAdd.placeholder`) },
			(ctx) => {
				if (ctx.$type !== 'text-prompt') return;
				if (!ctx.userInput) return;
				const name = (ctx.userInput as string).trim();
				ProfileService.addProfile(db, parentAcct, name);
				loadAccounts();
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
								{
									$type: 'text-prompt',
									placeholder: t(`hub.profileRename.placeholder`),
								},
								(ctx) => {
									if (ctx.$type !== 'text-prompt') return;
									if (!ctx.userInput) return;
									const name = (ctx.userInput as string).trim();
									ProfileService.renameProfileById(db, profileId, name);
									loadAccounts();
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
								{
									$type: 'text-prompt',
									placeholder: t(`hub.profileRename.placeholder`),
								},
								(ctx) => {
									if (ctx.$type !== 'text-prompt') return;
									if (!ctx.userInput) return;
									const name = (ctx.userInput as string).trim();
									ProfileService.renameProfileById(db, profileId, name);
									loadAccounts();
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

	// the hub interface is not long enough for smooth animations.
	// const { scrollHandler, animatedStyle } = useScrollHandleFlatList();

	return (
		<View style={{ backgroundColor: theme.background.a10, height: '100%' }}>
			<NavBar_Hub acct={parentAcct} />
			<ScrollView
				style={{
					backgroundColor: theme.palette.bg,
				}}
				refreshControl={
					<RefreshControl refreshing={Refreshing} onRefresh={refresh} />
				}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.hubVariantHeight,
				}}
				contentOffset={{ x: 0, y: appDimensions.topNavbar.hubVariantHeight }}
			>
				{/* --- Pinned Timelines --- */}
				<HubPinnedFeedList
					account={State.acct}
					items={State.pins.timelines}
					onPressAddFeed={onPressAddFeed}
				/>

				{/* --- Pinned Users --- */}
				<HubPinnedUserList
					parentAcct={State.acct}
					items={State.pins.users}
					profile={profile}
					onPressAddUser={onPressAddUser}
					onLongPressUser={onLongPressUser}
				/>

				{/* --- Pinned Tags --- */}
				<HubPinnedTagList
					items={State.pins.tags}
					parentAcct={State.acct}
					onPressAddTag={onPressAddTag}
					onLongPressTag={onLongPressTag}
				/>
				<View style={{ height: 72 }} />
			</ScrollView>

			<HubProfileListView
				onLongPressProfile={onLongPressProfile}
				onPressAddProfile={onPressAddProfile}
				onPressProfile={onPressProfile}
			/>
		</View>
	);
}

export default HubTab;
